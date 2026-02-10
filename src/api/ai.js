import api from "./axios";

export const generateExercises = (payload) =>
  api.post(`/admin/ai/generate-exercises`, payload);

export const generateExerciseImages = (exerciseId) =>
  api.post(`/admin/ai/generate-images/exercise/${exerciseId}`);

export const regenerateMediaImage = (mediaId, payload) =>
  api.post(`/admin/ai/generate-image/media/${mediaId}`, payload);

export const streamAiJob = async (jobId, { onMessage, onError, signal } = {}) => {
  const token = localStorage.getItem("token");
  const baseUrl = `${import.meta.env.VITE_API_BASE_URL}/admin/ai/jobs/${jobId}/events`;
  const url = new URL(baseUrl);
  if (token) {
    url.searchParams.set("access_token", token);
  }
  console.info("[AI SSE] Connecting", { jobId, url });
  const res = await fetch(url.toString(), {
    headers: {
      Accept: "text/event-stream",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    signal,
  });

  if (!res.ok) {
    const error = new Error(`Failed to connect to AI job stream (${res.status})`);
    console.error("[AI SSE] Connection failed", error);
    if (onError) onError(error);
    throw error;
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  const read = async () => {
    try {
      const { done, value } = await reader.read();
      if (done) {
        console.info("[AI SSE] Stream closed", { jobId });
        return;
      }
      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split(/\r?\n/);
      buffer = lines.pop() || "";
      lines.forEach((line) => {
        if (line.startsWith("data:")) {
          const payload = line.slice(5).trim();
          if (!payload) return;
          try {
            const data = JSON.parse(payload);
            console.info("[AI SSE] Message", data);
            if (onMessage) onMessage(data);
          } catch (e) {
            console.error("[AI SSE] Parse error", e);
            if (onError) onError(e);
          }
        }
      });
      await read();
    } catch (e) {
      if (e?.name === "AbortError" || signal?.aborted) {
        console.info("[AI SSE] Stream aborted", { jobId });
        return;
      }
      console.error("[AI SSE] Read error", e);
      if (onError) onError(e);
      throw e;
    }
  };

  await read();
};
