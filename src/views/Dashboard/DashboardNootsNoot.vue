<template>
  <b-list-group-item>
    <h5
      v-if="! isEditingTitle"
      @click="editTitle"
    >{{ noot.title }}</h5>
    <div v-if="isEditingTitle">
      <b-form
        inline
        @submit="patchTitle"
        @reset="cancelEditTitle"
      >
        <b-form-group
          :id="titleFormGroupId"
          label-for="titleFormInputId"
        >
          <b-form-input
            autofocus
            :id="titleFormInputId"
            :disabled="titleStatus.isLoading"
            v-model="newNootTitle"
            :placeholder="noot.title"
            @keyup.esc.native="cancelEditTitle"
          />
        </b-form-group>
        <b-button
          type="submit"
          variant="primary"
        >Update</b-button>
        <b-button type="reset">Cancel</b-button>
      </b-form>
    </div>
    <p
      v-if="! isEditingBody"
      @click="editBody"
    >{{ noot.body }}</p>
    <div v-if="isEditingBody">
      <b-form
        inline
        @submit="patchBody"
        @reset="cancelEditBody"
      >
        <b-form-group
          :id="bodyFormGroupId"
          label-for="bodyFormInputId"
        >
          <b-form-input
            autofocus
            :id="bodyFormInputId"
            :disabled="bodyStatus.isLoading"
            v-model="newNootBody"
            :placeholder="noot.body"
            @keyup.esc.native="cancelEditBody"
          />
        </b-form-group>
        <b-button
          type="submit"
          variant="primary"
        >Update</b-button>
        <b-button type="reset">Cancel</b-button>
      </b-form>
    </div>
  </b-list-group-item>
</template>

<script>
import axios from 'axios';
const API_URL = 'http://localhost:5000';

export default {
  name: 'DashboardNootsNoot',

  props: {
    noot: {
      type: Object,
      required: true,
    },
  },

  data() {
    return {
      isEditingTitle: false,
      newNootTitle: this.noot.title,
      titleStatus: {
        isLoading: false,
        error: null,
      },
      isEditingBody: false,
      newNootBody: this.noot.body,
      bodyStatus: {
        isLoading: false,
        error: null,
      },
    };
  },

  computed: {
    titleFormGroupId() {
      return `noot(${this.noot.id})_title_group`;
    },

    titleFormInputId() {
      return `noot(${this.noot.id})_title`;
    },

    bodyFormGroupId() {
      return `noot(${this.noot.id})_body_group`;
    },

    bodyFormInputId() {
      return `noot(${this.noot.id})_body`;
    },
  },

  methods: {
    // patchNoot(updates) {
    //   return axios.patch(`${API_URL}/noots/${this.noot.id}`, updates);
    // },

    ///////// Title

    editTitle() {
      this.newNootTitle = this.noot.title;
      this.isEditingTitle = true;
    },

    cancelEditTitle() {
      this.isEditingTitle = false;
    },

    patchTitle() {
      this.titleStatus.isLoading = true;

      return axios.patch(
        `${API_URL}/noots/${this.noot.id}`,
        { title: this.newNootTitle }
      )
        .then((res) => {
          this.titleStatus.isLoading = false;
          this.isEditingTitle = false;
          this.$emit('update', res.data);
        })
        .catch((error) => {
          this.titleStatus.isLoading = false;
          this.titleStatus.error = error;
        });
    },

    ///////// Body

    editBody() {
      this.newNootBody = this.noot.body;
      this.isEditingBody = true;
    },

    cancelEditBody() {
      this.isEditingBody = false;
    },

    patchBody() {
      this.bodyStatus.isLoading = true;

      return axios.patch(
        `${API_URL}/noots/${this.noot.id}`,
        { body: this.newNootBody }
      )
        .then((res) => {
          this.bodyStatus.isLoading = false;
          this.isEditingBody = false;
          this.$emit('update', res.data);
        })
        .catch((error) => {
          this.bodyStatus.isLoading = false;
          this.bodyStatus.error = error;
        });
    },
  },
};
</script>
