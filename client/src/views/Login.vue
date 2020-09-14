<template>
  <div v-if="message">
    <h5 class="text-center text-blue-grey-8">{{ message }}</h5>
  </div>
  <div v-else class="login-container">
    <div class="row justify-center">
      <q-btn rounded color="deep-orange" size="xl" @click="login()"
        >Sign In With Google</q-btn
      >
    </div>
  </div>
</template>

<script>
import { signIn, usersCollection } from "../firebase";
import { QSpinnerGears } from "quasar";

export default {
  data() {
    return {
      message: null,
    };
  },

  methods: {
    async login() {
      this.$q.loading.show({
        spinner: QSpinnerGears,
      });

      const creds = await signIn();
      const user = {
        loginEmail: creds.user.email,
        displayName: creds.user.displayName,
        uid: creds.user.uid,
      };

      const userSnap = await usersCollection.doc(user.uid).get();

      if (!userSnap.exists) {
        await usersCollection.doc(user.uid).set(user);
        this.message =
          "You've successfully registered. Once your account is approved you'll be able to use the platform";
        this.$q.loading.hide();
        return;
      }

      const firebaseUser = await this.getUser(user.uid);

      if (!firebaseUser.isApproved) {
        this.message = "Your account is pending approval";
        this.$q.loading.hide();
        return;
      }

      this.$q.loading.hide();
      this.$q.notify({
        type: "positive",
        message: `Welcome back ${firebaseUser.displayName}`,
      });
      this.$router.push(`/users/${firebaseUser.uid}`);
    },
    async getUser(uid) {
      const snap = await usersCollection.doc(uid).get();
      return await snap.data();
    },
  },
};
</script>

<style scoped>
.login-container {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 50%;
}
</style>
