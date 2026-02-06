<template>
  <v-dialog v-model="dialog" max-width="600">
    <v-card class="pa-4">
      <h3>{{ program ? "Edit" : "Create" }} Program</h3>

      <v-text-field label="Title" v-model="form.title" />

      <label class="v-label">Description</label>
      <!-- TipTap Toolbar -->
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

      <!-- TipTap Editor -->
      <div class="tiptap-wrapper mb-6">
        <EditorContent v-if="editor" :editor="editor" />
      </div>

      <v-select label="Category" :items="categories" v-model="form.category" />
      <v-select label="Goal" :items="goals" v-model="form.goal" />

      <v-text-field
        label="Duration (Days)"
        type="number"
        v-model="form.durationDays"
      />

      <v-switch label="Active" v-model="form.active" />

      <v-btn color="primary" @click="save">Save</v-btn>
      <v-btn @click="$emit('close')">Cancel</v-btn>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, watch, onMounted, onBeforeUnmount } from "vue";
import { Editor, EditorContent } from "@tiptap/vue-3";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import { createProgram, updateProgram } from "@/api/programs";

const props = defineProps(["program"]);
const emit = defineEmits(["close", "saved"]);

const dialog = ref(true);

const form = ref({
  title: "",
  description: "",
  category: "",
  goal: "",
  durationDays: 30,
  active: true,
});

const editor = ref(null);

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
  if (props.program?.description) {
    editor.value.commands.setContent(props.program.description);
  }
});

onBeforeUnmount(() => {
  editor.value?.destroy();
});

const categories = ["GYM", "YOGA", "HIIT", "MEDITATION", "PILATES", "ZUMBA"];
const goals = [
  "MUSCLE_GAIN",
  "FAT_LOSS",
  "FLEXIBILITY",
  "STRESS_RELIEF",
  "SLEEP",
  "ASTHMA",
];

watch(
  () => props.program,
  (p) => {
    if (p) form.value = { ...p };
    if (editor.value) {
      editor.value.commands.setContent(p?.description || "");
    }
  },
  { immediate: true }
);

const save = async () => {
  if (props.program) {
    await updateProgram(props.program.id, form.value);
  } else {
    await createProgram(form.value);
  }

  emit("saved");
  emit("close");
};
</script>
