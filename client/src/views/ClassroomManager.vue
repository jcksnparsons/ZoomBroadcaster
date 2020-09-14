<template>
  <div>
    <h2 class="text-blue-grey-10 q-mb-sm text-center">Classroom Manager</h2>
    <h5 class="text-blue-grey-5 q-my-none text-center">{{ username }}</h5>
    <div class="row justify-center q-my-sm">
      <div>
        <q-btn
          flat
          color="deep-orange"
          :ripple="false"
          @click="showingForm = true"
        >
          Add Classroom
        </q-btn>
      </div>
    </div>
    <div class="row justify-around" v-if="!showingForm">
      <classroom-summary
        class="col-sm-12 col-md-6 col-lg-4 col-xl-3"
        v-for="(classroom, i) in classrooms"
        :classroom="classroom"
        :key="i"
      />
    </div>
    <div class="row justify-around" v-else>
      <new-classroom-form
        @cancel="showingForm = false"
        class="col-sm-12 col-md-6 col-lg-4 col-xl-3"
      />
    </div>
  </div>
</template>

<script>
import { auth, classroomsCollection } from "../firebase";
import ClassroomSummary from "../components/ClassroomSummary.vue";
import NewClassroomForm from "../components/NewClassroomForm.vue";

export default {
  components: { ClassroomSummary, NewClassroomForm },

  data() {
    return {
      username: auth.currentUser.displayName,
      showingForm: false,
      classrooms: [],
    };
  },

  async mounted() {
    const { userId } = this.$route.params;
    classroomsCollection
      .where("instructorId", "==", userId)
      .onSnapshot((snap) => {
        this.classrooms = snap.docs.map((d) => {
          return {
            id: d.id,
            ...d.data(),
          };
        });
      });
  },
};
</script>

<style></style>
