<template>
  <b-card>
    <h4 class="card-title">
      Noots
      <i
        v-if="nootsStatus.isLoading"
        class="icon-refresh icon-spin"
      />
    </h4>
    <b-list-group>
      <dashboard-noots-noot
        v-for="noot of noots"
        :key="noot.id"
        :noot="noot"
        @update="updateNoot"
      />
      <b-list-group-item v-if="! noots.length">
        <div class="text-muted">No noots...</div>
      </b-list-group-item>
    </b-list-group>
    <div slot="footer">
      <b-form
        inline
        @submit="submitNewNoot"
        @reset="resetNewNoot"
      >
        <b-form-group
          id="new-noot_title_group"
          label-for="new-noot_title"
        >
          <b-form-input
            id="new-noot_title"
            v-model="newNoot.title"
            required
            placeholder="Title"
          />
        </b-form-group>
        <b-form-group
          id="new-noot_body_group"
          label-for="new-noot_body"
        >
          <b-form-input
            id="new-noot_body"
            v-model="newNoot.body"
            required
            placeholder="Body"
          />
        </b-form-group>
        <b-button
          type="submit"
          variant="primary"
        >Add Noot</b-button>
        <b-button type="reset">Reset</b-button>
      </b-form>
    </div>
  </b-card>
</template>

<script>
import axios from 'axios';
import DashboardNootsNoot from './DashboardNootsNoot';

const API_URL = 'http://localhost:5000';

export default {
  name: 'DashboardNoots',

  data() {
    return {
      nootsStatus: {
        isLoading: false,
        hasLoadedBefore: false,
        error: null,
      },
      noots: [],
      newNoot: {
        title: '',
        body: '',
      },
    };
  },

  methods: {
    // API connections

    updateNootsStatus(updates) {
      ['isLoading', 'hasLoadedBefore', 'error'].forEach(key => {
        if (updates.hasOwnProperty(key)) {
          this.nootsStatus[key] = updates[key];
        }
      });
    },

    getNoots() {
      return axios.get(`${API_URL}/noots`, {
        headers: {
          'accept': 'application/json',
        },
      });
    },

    postNoot() {
      return axios.post(`${API_URL}/noots`, Object.assign({}, this.newNoot));
    },

    loadNoots() {
      this.updateNootsStatus({
        isLoading: true,
      });

      return this.getNoots()
      .then(res => {
        if (res.status === 200) {
          this.noots = res.data;
          this.updateNootsStatus({
            isLoading: false,
            hasLoadedBefore: true,
          });
        }
        else {
          this.updateNootsStatus({
            isLoading: false,
            error: res.data,
          });
        }
      })
      .catch(error => {
        this.updateNootsStatus({
          isLoading: false,
          error: error,
        });
      });
    },

    updateNoot(updates) {
      const noot = this.noots.find(n => n.id === updates.id);

      if (! noot) {
        // eslint-disable-next-line
        console.warn(`Cannot update noot#${updates.id}: We don't have that one!`);
        return;
      }

      // We should only receive valid props from the server.
      Object.assign(noot, updates);
    },

    submitNewNoot() {
      return this.postNoot()
        .then((newNoot) => {
          // Preemtively push new one before refreshing all.
          this.noots.push(newNoot);

          // Reset form.
          this.newNoot.title = '';
          this.newNoot.body = '';

          // Fetch all.
          // NOTE: This updates the status too,
          // so there's no point doing it here.
          return this.loadNoots();
        })
        .catch((error) => {
          this.updateNootsStatus({
            isLoading: false,
            error: error,
          })
        })
        ;
    },

    resetNewNoot() {
      this.newNoot.title = '';
      this.newNoot.body = '';
    },
  },

  mounted() {
    this.loadNoots();
  },

  components: {
    DashboardNootsNoot,
  },
};
</script>
