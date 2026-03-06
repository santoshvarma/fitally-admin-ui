<template>
  <v-dialog v-model="dialog" max-width="900">
    <v-card class="pa-4">
      <h3>{{ contentItem ? "Edit" : "Create" }} CMS Content</h3>

      <v-text-field label="Title" v-model="form.title" />

      <v-select
        label="Page"
        :items="pages"
        item-title="title"
        item-value="value"
        v-model="form.appPageKey"
      />

      <v-select label="Type" :items="availableTypes" v-model="form.type" />

      <v-text-field
        v-if="showZoneField"
        label="Zone"
        v-model="zone"
        :readonly="!isHomePage"
        hint="Example: hero, quick_actions, recommendation"
        persistent-hint
      />

      <v-text-field
        v-if="showIconField"
        label="Icon"
        v-model="icon"
        hint="Material icon name (example: fitness_center)"
        persistent-hint
      />

      <v-text-field
        v-if="showTargetFields"
        label="Target Type"
        v-model="targetType"
        hint="Example: CATEGORY, WORKOUT, EXERCISE, URL"
        persistent-hint
      />

      <v-text-field
        v-if="showTargetFields"
        label="Target Value"
        v-model="targetValue"
      />

      <v-text-field
        v-if="showCtaFields"
        label="CTA Text"
        v-model="ctaText"
      />

      <v-text-field
        v-if="showCtaFields"
        label="CTA URL"
        v-model="ctaUrl"
      />

      <v-text-field
        v-if="showBadgeField"
        label="Badge"
        v-model="badge"
      />

      <label class="v-label">Description</label>
      <div class="editor-toolbar mb-2">
        <v-btn
          size="small"
          icon
          @click="editor.chain().focus().toggleBold().run()"
        >
          <v-icon>mdi-format-bold</v-icon>
        </v-btn>

        <v-btn
          size="small"
          icon
          @click="editor.chain().focus().toggleItalic().run()"
        >
          <v-icon>mdi-format-italic</v-icon>
        </v-btn>

        <v-btn
          size="small"
          icon
          @click="editor.chain().focus().toggleBulletList().run()"
        >
          <v-icon>mdi-format-list-bulleted</v-icon>
        </v-btn>

        <v-btn
          size="small"
          icon
          @click="
            editor.chain().focus().setLink({
              href: prompt('Enter URL'),
            }).run()
          "
        >
          <v-icon>mdi-link</v-icon>
        </v-btn>
      </div>

      <div class="tiptap-wrapper mb-6">
        <EditorContent v-if="editor" :editor="editor" />
      </div>

      <v-file-input
        v-if="supportsImageUpload"
        label="Upload Image"
        v-model="imageFile"
        accept="image/*"
        prepend-icon="mdi-image"
      />

      <v-text-field
        label="Display Order"
        type="number"
        v-model="form.displayOrder"
      />

      <v-textarea
        label="Metadata (JSON)"
        v-model="metadataText"
        rows="4"
      />

      <v-switch label="Active" v-model="form.active" />

      <div class="d-flex ga-2">
        <v-btn color="primary" :loading="saving" :disabled="saving" @click="save">
          Save
        </v-btn>
        <v-btn :disabled="saving" @click="$emit('close')">Cancel</v-btn>
      </div>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, watch, onMounted, onBeforeUnmount, computed } from "vue";
import { Editor, EditorContent } from "@tiptap/vue-3";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import { createContent, updateContent, uploadContentImage } from "@/api/cms";
import { getAppPages } from "@/api/app-pages";

const props = defineProps(["contentItem"]);
const emit = defineEmits(["close", "saved"]);

const dialog = ref(true);
const saving = ref(false);

const form = ref({
  title: "",
  description: "",
  type: "SECTION",
  appPageKey: "home",
  page: "HOME",
  metadata: null,
  displayOrder: 1,
  active: true,
});

const metadataText = ref("");
const pages = ref([]);
const imageFile = ref(null);

const zone = ref("");
const icon = ref("");
const targetType = ref("");
const targetValue = ref("");
const ctaText = ref("");
const ctaUrl = ref("");
const badge = ref("");

const editor = ref(null);

const types = [
  "BANNER",
  "QUICK_ACTION",
  "RECOMMENDATION",
  "SECTION",
  "TIP",
  "PAGE",
  "ARTICLE",
  "PROMOTION",
  "HEADER",
  "FOOTER",
];

const showZoneField = computed(() =>
  ["BANNER", "QUICK_ACTION", "RECOMMENDATION", "SECTION", "PROMOTION"].includes(
    form.value.type
  )
);
const isHomePage = computed(() => (form.value.appPageKey || "").toLowerCase() === "home");
const availableTypes = computed(() =>
  isHomePage.value
    ? ["BANNER", "QUICK_ACTION", "RECOMMENDATION"]
    : ["BANNER"]
);

const showIconField = computed(() => form.value.type === "QUICK_ACTION");
const showTargetFields = computed(() =>
  ["QUICK_ACTION", "RECOMMENDATION", "PROMOTION"].includes(form.value.type)
);
const showCtaFields = computed(() =>
  ["BANNER", "PROMOTION", "ARTICLE", "PAGE"].includes(form.value.type)
);
const showBadgeField = computed(() =>
  ["BANNER", "RECOMMENDATION", "PROMOTION"].includes(form.value.type)
);

const supportsImageUpload = computed(() =>
  ["BANNER", "SECTION", "RECOMMENDATION", "PROMOTION", "ARTICLE", "PAGE", "TIP"].includes(
    form.value.type
  )
);

onMounted(() => {
  editor.value = new Editor({
    extensions: [
      StarterKit,
      Link.configure({ openOnClick: false }),
    ],
    content: "",
    onUpdate({ editor }) {
      form.value.description = editor.getHTML();
    },
  });

  if (props.contentItem?.description) {
    editor.value.commands.setContent(props.contentItem.description);
  }
});

onBeforeUnmount(() => {
  editor.value?.destroy();
});

const normalizeType = (rawType) => {
  const t = (rawType || "").toString().trim().toUpperCase();
  const legacyMap = {
    HOME_BANNER: "BANNER",
    HOME_QUICK_ACTION: "QUICK_ACTION",
    DAILY_RECOMMENDATION: "RECOMMENDATION",
    FEATURED_SECTION: "SECTION",
  };
  return legacyMap[t] || t || "SECTION";
};

const parseMetadataObject = (raw) => {
  if (!raw) return {};
  if (typeof raw === "string") {
    try {
      return JSON.parse(raw);
    } catch {
      return {};
    }
  }
  return raw;
};

const applyMetadataToFields = (obj) => {
  zone.value = (obj.zone || "").toString();
  icon.value = (obj.icon || "").toString();
  targetType.value = (obj.targetType || "").toString();
  targetValue.value = (obj.targetValue || "").toString();
  ctaText.value = (obj.ctaText || "").toString();
  ctaUrl.value = (obj.ctaUrl || "").toString();
  badge.value = (obj.badge || "").toString();
};

watch(
  () => props.contentItem,
  (c) => {
    if (c) {
      const derivedPageKey = (c.appPageKey || c.page || "HOME")
        .toString()
        .toLowerCase();
      const parsedMetadata = parseMetadataObject(c.metadata);

      form.value = {
        ...c,
        type: normalizeType(c.type),
        appPageKey: derivedPageKey,
      };
      metadataText.value = JSON.stringify(parsedMetadata, null, 2);
      applyMetadataToFields(parsedMetadata);
    } else {
      const firstPageKey = pages.value[0]?.value || "home";
      form.value = {
        title: "",
        description: "",
        type: "SECTION",
        appPageKey: firstPageKey,
        page: firstPageKey.toUpperCase(),
        metadata: null,
        displayOrder: 1,
        active: true,
      };
      metadataText.value = "";
      applyMetadataToFields({});
      imageFile.value = null;
    }

    if (editor.value) {
      editor.value.commands.setContent(c?.description || "");
    }
  },
  { immediate: true }
);

watch(
  () => form.value.appPageKey,
  (pageKey) => {
    const normalized = (pageKey || "").toString().toLowerCase();
    if (normalized !== "home") {
      form.value.type = "BANNER";
      zone.value = "ad_pane";
      return;
    }

    if (!availableTypes.value.includes(form.value.type)) {
      form.value.type = "BANNER";
    }
    if (zone.value === "ad_pane") {
      zone.value = "hero";
    }
  }
);

const save = async () => {
  if (saving.value) return;

  let parsedMetadata = {};
  if (metadataText.value.trim().length > 0) {
    try {
      parsedMetadata = JSON.parse(metadataText.value);
    } catch (e) {
      window.alert("Metadata must be valid JSON.");
      return;
    }
  }

  if (zone.value.trim()) parsedMetadata.zone = zone.value.trim();
  if (icon.value.trim()) parsedMetadata.icon = icon.value.trim();
  if (targetType.value.trim()) parsedMetadata.targetType = targetType.value.trim();
  if (targetValue.value.trim()) parsedMetadata.targetValue = targetValue.value.trim();
  if (ctaText.value.trim()) parsedMetadata.ctaText = ctaText.value.trim();
  if (ctaUrl.value.trim()) parsedMetadata.ctaUrl = ctaUrl.value.trim();
  if (badge.value.trim()) parsedMetadata.badge = badge.value.trim();

  form.value.metadata = Object.keys(parsedMetadata).length ? parsedMetadata : null;
  form.value.type = normalizeType(form.value.type);
  form.value.appPageKey = (form.value.appPageKey || "home").toLowerCase();
  if (form.value.appPageKey !== "home") {
    form.value.type = "BANNER";
    parsedMetadata.zone = "ad_pane";
    form.value.metadata = parsedMetadata;
  }
  form.value.page = form.value.appPageKey.toUpperCase();

  saving.value = true;
  try {
    let savedItem;

    if (props.contentItem) {
      const res = await updateContent(props.contentItem.id, form.value);
      savedItem = res?.data || props.contentItem;
    } else {
      const res = await createContent(form.value);
      savedItem = res?.data;
    }

    if (supportsImageUpload.value && imageFile.value && savedItem?.id) {
      const formData = new FormData();
      formData.append("file", imageFile.value);
      formData.append("title", `${form.value.title} Image`);
      const plainDescription = (form.value.description || "")
        .replace(/<[^>]*>/g, " ")
        .replace(/\s+/g, " ")
        .trim();
      formData.append("description", plainDescription || form.value.title);
      await uploadContentImage(savedItem.id, formData);
    }

    emit("saved");
    emit("close");
  } finally {
    saving.value = false;
  }
};

onMounted(async () => {
  const res = await getAppPages();
  pages.value = (Array.isArray(res.data) ? res.data : []).map((p) => ({
    title: p.title,
    value: p.pageKey,
  }));

  if (!form.value.appPageKey && pages.value.length > 0) {
    form.value.appPageKey = pages.value[0].value;
    form.value.page = form.value.appPageKey.toUpperCase();
  }
});
</script>
