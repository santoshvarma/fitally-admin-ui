<template>
  <v-dialog v-model="dialog" max-width="800">
    <v-card class="pa-4">
      <h3>{{ contentItem ? "Edit" : "Create" }} CMS Content</h3>

      <v-text-field label="Title" v-model="form.title" />

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

      <v-select label="Type" :items="types" v-model="form.type" />
      <v-text-field label="Page" v-model="form.page" />
      <v-text-field
        label="Display Order"
        type="number"
        v-model="form.displayOrder"
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
import { createContent, updateContent } from "@/api/cms";

const props = defineProps(["contentItem"]);
const emit = defineEmits(["close", "saved"]);

const dialog = ref(true);

const form = ref({
  title: "",
  description: "",
  type: "",
  page: "HOME",
  displayOrder: 1,
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
  if (props.contentItem?.description) {
    editor.value.commands.setContent(props.contentItem.description);
  }
});

onBeforeUnmount(() => {
  editor.value?.destroy();
});

const types = [
  "HOME_BANNER",
  "FEATURED_SECTION",
  "PAGE",
  "ARTICLE",
  "PROMOTION",
  "HEADER",
  "FOOTER",
];

watch(
  () => props.contentItem,
  (c) => {
    if (c) form.value = { ...c };
    if (editor.value) {
      editor.value.commands.setContent(c?.description || "");
    }
  },
  { immediate: true }
);

const save = async () => {
  if (props.contentItem) {
    await updateContent(props.contentItem.id, form.value);
  } else {
    await createContent(form.value);
  }

  emit("saved");
  emit("close");
};
</script>
