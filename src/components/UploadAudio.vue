<template>
  <div id="UploadAudio">
    <b-container id="topPage" border-variant="dark">
      <div>
        <hr class="my-4" />
        
        {{ $session.get("myI") }}
        <!-- <br /><br />
        info : {{ info }} <br /><br />
        infos : {{ infos }} <br /><br />
        infop : {{ infop }} <br /><br /> -->

        <b-jumbotron bg-variant="info" text-variant="white" border-variant="dark">
          <template slot="header">
            Upload Audio File Here
          </template>
         
        </b-jumbotron>
        <div>
           <hr class="my-4" />
  <b-card title="File Upload">
    
     <hr class="my-4" />
          <form enctype="multipart/form-data">
            <div class="form-horizontal">
              <div class="form-group">
                <div class="col-md-10">
                  <input
                    type="file"
                    id="photoUrl"
                    name="myFileName"
                    v-on:change="fileChange($event.target.files)"
                    accept="application/vnd.msword, application/vnd.ms-excel, application/vnd.ms-powerpoint, text/plain, application/pdf, image/*"
                  />
                </div>
              </div>
            </div>
            <div class="form-group">
              <button
                type="button"
                v-on:click="created()"
                class="btn btn-primary btn-lg"
                style="width:25%;"
              >
                Add
              </button>
            </div>
          </form>

          <hr class="my-4" />
    
  </b-card>
</div>
      </div>
    </b-container>
  </div>
</template>

<script>
import Vue from "vue";
import axios from "axios";
import VueSession from "vue-session";
Vue.use(VueSession);
export default {
  name: "UploadAudio",
  data() {
    return {
      files: new FormData(),
      info: null,
      infos: null,
      infop: null,
      know: null,
      myFileName: null,
      myNumber: null,
      myFileNameA: null,
      page: null,
      book: null,
      myId: null
    };
  },
  beforeMount() {
    axios({
      method: "POST",
      url: "https://ad440-dev-function.azurewebsites.net/v1/sastoken/",
      data: { container: "merryfairytalesassets" },
      headers: { "Content-Type": "application/json" }
    })
      .then(response => {
        this.$session.set("myI", response.data.token);
      })
      .catch(error => (this.info = error));
  },
  mounted() {
    this.myId = this.$route.query.id;
    this.myNumber = this.$route.query.page;
    this.myFileNameA = this.myId + "_audio_" + this.myNumber + ".mp3";
    axios
      .get(
        "https://ad440-dev-function.azurewebsites.net/v1/books/" + this.myId
      )
      .then(response => (this.book = response.data))
      .catch(error => (this.infos = error));
  },
  methods: {
    fileChange(fileList) {
      this.files.append("file", fileList[0], fileList[0].name);
      //this.myNumber = this.book.pages[index].number;
      //this.myFileNameA = this.book.id + "_image_"  + this.myNumber + ".JPG";
    },
    created() {
      var myDate = new Date();
      var myUrl =
        "https://ad440uidevassetstorage.blob.core.windows.net/merryfairytalesassets/" +
        this.myFileNameA +
        this.$session.get("myI");
      axios({
        method: "PUT",
        url: myUrl,
        data: this.files,
        headers: {
          "x-ms-blob-type": "BlockBlob",
          "x-ms-date": myDate,
          "x-ms-version": "2018-03-28",
          "Content-Type": "multipart/form-data"
        },
        ContentLength: this.files.length
      })
        .then(response => (this.infos = response.data))
        .catch(error => (this.infos = error));

      //edit json file to pass to API
      //redirect logic
      //this.book.pages.languages.audio_url =
        //"https://ad440uidevassetstorage.blob.core.windows.net/merryfairytalesassets/" + this.myFileNameA;
      var myUrl2 =
        "https://ad440-dev-function.azurewebsites.net/v1/books/" + this.myId + "/pages/" + this.myNumber;
      axios
        .put(myUrl2, this.book)
        .then(response => (this.infop = response.data))
        .catch(error => (this.infop = error));
      this.$router.push({ name: "AddPage", query: { id: this.book.id, page: this.myNumber } });
    }
  }
};
</script>