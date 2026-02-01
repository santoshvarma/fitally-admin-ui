<template>
  <v-dialog v-model="model" max-width="900">
    <v-card>
      <v-card-title>
        {{ isEdit ? "Edit Workout" : "Create Workout" }}
      </v-card-title>

      <v-card-text class="d-flex flex-column ga-4">
        <v-text-field
          label="Title"
          v-model="form.title"
          required
        />


        <!-- TipTap Toolbar -->
        <div class="tiptap-field">
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

          <!-- TipTap Editor -->
          <div class="tiptap-wrapper mb-6">
            <EditorContent v-if="editor" :editor="editor"/>
          </div>
        </div>

        <v-row>
          <v-col>
            <v-select
              label="Category"
              :items="categories"
              v-model="form.category"
            />
          </v-col>

          <v-col>
            <v-select
              label="Difficulty"
              :items="difficulties"
              v-model="form.difficulty"
            />
          </v-col>

          <v-col>
            <v-select
              label="Equipment"
              :items="equipment"
              v-model="form.equipmentType"
            />
          </v-col>
        </v-row>

        <!-- Exercises Multi Select -->
        <v-select
          multiple
          chips
          :items="exercises"
          item-title="title"
          item-value="id"
          v-model="selectedExercises"
          :menu-props="{ maxHeight: 300 }"
        />


        <v-list class="mt-2" density="compact">
          <v-list-item
            v-for="(id, index) in selectedExercises"
            :key="id"
          >
            <v-list-item-title>
              {{ exerciseMap[id]?.title }}
            </v-list-item-title>

            <template #append>
              <v-btn
                icon
                size="small"
                :disabled="index === 0"
                @click="moveUp(index)"
              >
                <v-icon>mdi-arrow-up</v-icon>
              </v-btn>
              <v-btn
                icon
                size="small"
                :disabled="index === selectedExercises.length - 1"
                @click="moveDown(index)"
              >

              <v-icon>mdi-arrow-down</v-icon>
              </v-btn>
            </template>
          </v-list-item>
        </v-list>



        <v-row>
          <v-col>
            <v-switch
              label="Equipment Required"
              v-model="form.equipmentRequired"
            />
          </v-col>
          <v-col>
            <v-switch
              label="Active"
              v-model="form.active"
            />
          </v-col>
        </v-row>
      </v-card-text>

      <v-card-actions class="justify-end">
        <v-btn variant="text" @click="close">Cancel</v-btn>
        <v-btn color="primary" @click="save">Save</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import {ref, watch, computed, onMounted, onBeforeUnmount} from "vue";
import {Editor, EditorContent} from "@tiptap/vue-3";
import StarterKit from "@tiptap/starter-kit";
import {createWorkout, updateWorkout} from "@/api/workouts";
import {getAllExercises} from "@/api/exercises";

const props = defineProps({
  workout: Object,
  modelValue: Boolean,
});
const emit = defineEmits(["update:modelValue", "saved"]);

const model = computed({
  get: () => props.modelValue,
  set: (v) => emit("update:modelValue", v),
});


const isEdit = computed(() => !!props.workout);

const form = ref({
  title: "",
  description: "",
  category: null,
  difficulty: null,
  equipmentType: null,
  equipmentRequired: false,
  active: true,
  exerciseIds: [],
});

const categories = ["GYM", "YOGA", "PILATES", "MEDITATION", "HIIT", "ZUMBA"];
const difficulties = ["BEGINNER", "INTERMEDIATE", "ADVANCED"];
const equipment = [
  "DUMBBELL",
  "BARBELL",
  "KETTLEBELL",
  "MACHINE",
  "BODYWEIGHT",
  "HOME",
  "NONE",
];

const exercises = ref([]);

const editor = new Editor({
  extensions: [StarterKit],
  content: "",
  onUpdate({editor}) {
    form.value.description = editor.getHTML();
  },
});

const selectedExercises = ref([]);

const exerciseMap = computed(() =>
  Object.fromEntries(exercises.value.map(e => [e.id, e]))
);

const moveUp = (i) => {
  if (i === 0) return;
  [selectedExercises.value[i - 1], selectedExercises.value[i]] =
    [selectedExercises.value[i], selectedExercises.value[i - 1]];
};

const moveDown = (i) => {
  if (i === selectedExercises.value.length - 1) return;
  [selectedExercises.value[i + 1], selectedExercises.value[i]] =
    [selectedExercises.value[i], selectedExercises.value[i + 1]];
};



watch(
  () => props.workout,
  (w) => {
    if (!w) return;

    const orderedIds = Array.isArray(w.exercises)
      ? w.exercises.map(e => e.id)
      : [];

    form.value = {
      title: w.title,
      description: w.description,
      category: w.category,
      difficulty: w.difficulty,
      equipmentType: w.equipmentType,
      equipmentRequired: w.equipmentRequired,
      active: w.active,
      exerciseIds: orderedIds,
    };

    selectedExercises.value = [...orderedIds];
    editor.commands.setContent(w.description || "");
  },
  { immediate: true }
);



const save = async () => {
  form.value.exerciseIds = [...selectedExercises.value];

  const payload = { ...form.value };

  if (!props.workout?.id) {
    await createWorkout(payload);
  } else {
    await updateWorkout(props.workout.id, payload);
  }

  emit("saved");
  close();
};




const close = () => {
  model.value = false;
};

const loadExercises = async () => {
  try {
    const res = await getAllExercises();

    const list = Array.isArray(res.data)
      ? res.data
      : Array.isArray(res.data?.content)
        ? res.data.content
        : [];

    exercises.value = list;
  } catch (e) {
    console.error("Failed to load exercises", e);
    exercises.value = [];
  }
};


onMounted(loadExercises);
onBeforeUnmount(() => editor.destroy());
</script>

<style scoped>

</style>
