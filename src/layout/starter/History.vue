<template>
  <div>
    <h1 class="text-center display-1">SSL Test History</h1>

    <card>
      <form @submit.prevent @submit="refresh">
        <base-input label="Test Select">
          <select class="form-control select-primary" id="testSelect" v-model="current">
            <option v-for="(value,key,index) in history.items" :key="index" :value="key">{{key}} </option>
          </select>
        </base-input>
        <base-button
          native-type="submit"
          type="primary"
          :loading="processing"
          block
          >Refresh</base-button
        >
      </form>
    </card>

    <div v-if="result">
      <card>
        <h2 class="card-title text-center display-3">
          Test Results for <b>{{ current }}</b>
        </h2>
        <hr />
        <!-- <h6 class="card-subtitle mb-2 text-muted">Card subtitle</h6> -->

        <div>
          <h2 class="display-4 text-center">Overall Result</h2>
          <h1
            :style="{ color: color(result.ssl_grade) }"
            class="text-center giant"
          >
            {{ result.ssl_grade }}
          </h1>
          <hr />
          <h2 class="display-4 text-center">Details</h2>

          <div class="row text-center ">
            <div class="col">
              <base-radio
                inline
                name="pretty"
                class="mb-3 text-center"
                v-model="raw"
                >Pretty</base-radio
              >
            </div>
            <div class="col">
              <base-radio
                inline
                name="raw"
                class="mb-3 text-center"
                v-model="raw"
                >Raw</base-radio
              >
            </div>
          </div>

          <div v-if="raw == 'pretty'">
            <table class="table table-bordered table-hover">
              <thead>
                <tr>
                  <th scope="col" colspan="2">General Results</th>
                </tr>
                <tr>
                  <th scope="col">Property</th>
                  <th scope="col">Value</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="value in filteredResult" :key="value[0]">
                  <td>{{ value[0] }}</td>
                  <td v-if="value[0] != 'Logo'">{{ value[1] }}</td>
                  <td v-if="value[0] == 'Logo'"><img :src="value[1]" /></td>
                </tr>
              </tbody>
            </table>

            <table class="table table-bordered table-hover">
              <thead>
                <tr>
                  <th scope="col" colspan="4">Results by Endpoint</th>
                </tr>
                <tr>
                  <th scope="col">Adress</th>
                  <th scope="col">SSL Grade</th>
                  <th scope="col">Country</th>
                  <th scope="col">Owner</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="value in result.servers" :key="value.address">
                  <td>{{ value.address }}</td>
                  <td>{{ value.ssl_grade }}</td>
                  <td>{{ value.country }}</td>
                  <td>{{ value.owner }}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <json-viewer
            v-if="raw == 'raw'"
            :value="result"
            :expand-depth="5"
            copyable
            boxed
            sort
          ></json-viewer>
        </div>
      </card>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import JsonViewer from "vue-json-viewer";
import "vue-json-viewer/style.css";
export default {
  data() {
    return {
      history: null,
      processing: false,
      current: null,
      raw: "pretty",
      result:null
    };
  },
  methods:{
    color(score) {
      var result;
      if (score == "A" || score == "A+" || score == "A-") {
        result = "green";
      } else if (score == "B") {
        result = "yellow";
      } else {
        result = "red";
      }
      return result;
    },
    refresh() {
      axios
      .get("http://localhost:8081/history")
      .then(response => {
        let data = response.data;
        this.history = data
        console.log(this.history)

        this.processing = false;
      })
      .catch(error => {
        console.log(error);
        this.processing = false;
      });
    }
  },
  mounted() {
    this.refresh();
  },
  computed: {
    filteredResult() {
      var result = [];
      var mapper = {
        servers_changed: "Servers changed",
        ssl_grade: "SSL Grade",
        previous_ssl_grade: "Previous SSL Grade",
        logo: "Logo",
        title: "Title",
        is_down: "Is Down"
      };
      for (const key in this.result) {
        if (key != "servers") {
          result.push([mapper[key], this.result[key]]);
        }
      }
      return result;
    }
   },
  components: {
    JsonViewer
  },
  watch: {
    current: function (val) {

      this.result = this.history.items[val]
      console.log(this.result)
    }}
};
</script>

<style>
.giant {
  font-size: 75px;
}

.table td {
  text-align: center;
}

.table th {
  text-align: center;
}
</style>
