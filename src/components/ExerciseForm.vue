<script setup>
import { ref, watch, onMounted, onBeforeUnmount } from "vue";
import { Editor, EditorContent } from "@tiptap/vue-3";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";

import { createExercise, updateExercise } from "@/api/exercises";

const props = defineProps({ exercise: Object });
const emit = defineEmits(["saved", "close"]);
const dialog = ref(true);

const form = ref({
  title: "",
  description: "",
  equipmentType: "",
  category: "GYM",
});

/* ---------------------------------------
   TipTap Editor
--------------------------------------- */
const editor = ref(null);
const pendingExercise = ref(null);

const applyExercise = (val) => {
  if (!val) {
    return;
  }
  form.value = {
    title: val.title,
    description: val.description,
    equipmentType: val.equipmentType,
    category: val.category,
  };
  editor.value?.commands.setContent(val.description || "");
};

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
  if (pendingExercise.value) {
    applyExercise(pendingExercise.value);
    pendingExercise.value = null;
  }
});

onBeforeUnmount(() => {
  editor.value?.destroy();
});

/* ---------------------------------------
   Select Data
--------------------------------------- */
const equipmentTypes = [
  { title: "Dumbbell", value: "DUMBBELL" },
  { title: "Barbell", value: "BARBELL" },
  { title: "Kettlebell", value: "KETTLEBELL" },
  { title: "Machine", value: "MACHINE" },
  { title: "Bodyweight", value: "BODYWEIGHT" },
  { title: "Home", value: "HOME" },
  { title: "None", value: "NONE" },
];

const fitnessCategories = [
  { title: "Gym", value: "GYM" },
  { title: "Yoga", value: "YOGA" },
  { title: "Pilates", value: "PILATES" },
  { title: "Meditation", value: "MEDITATION" },
  { title: "HIIT", value: "HIIT" },
  { title: "Zumba", value: "ZUMBA" },
];

/* ---------------------------------------
   Load Exercise (Edit Mode)
--------------------------------------- */
watch(
  () => props.exercise,
  (val) => {
    if (!val) {
      return;
    }
    if (!editor.value) {
      pendingExercise.value = val;
      return;
    }
    applyExercise(val);
  },
  { immediate: true }
);

/* ---------------------------------------
   Save
--------------------------------------- */
const save = async () => {
  props.exercise
    ? await updateExercise(props.exercise.id, form.value)
    : await createExercise(form.value);

  emit("saved");
};
</script>

<template>
  <v-dialog v-model="dialog" max-width="600">
  <v-card>
      <v-card-title>Exercise</v-card-title>

      <v-card-text>
        <v-text-field
          label="Title"
          v-model="form.title"
        />

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

        <v-select
          label="Equipment Type"
          :items="equipmentTypes"
          item-title="title"
          item-value="value"
          v-model="form.equipmentType"
          clearable
        />

        <v-select
          label="Fitness Category"
          :items="fitnessCategories"
          item-title="title"
          item-value="value"
          v-model="form.category"
        />
      </v-card-text>

      <v-card-actions>
        <v-btn text @click="$emit('close')">Cancel</v-btn>
        <v-btn color="primary" @click="save">Save</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<style scoped>

</style>
