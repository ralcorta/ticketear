<template>
  <div class="global-container">
    <div></div>
    <div class="row">
      <div class="col-12">
        <p class="text-center">Obtener posicion en la cola</p>
      </div>
      <div class="col-lg-10 col-md-8">
        <input class="form-control" type="text" v-model="token" />
      </div>
      <div class="col-lg-2 col-md-4">
        <button @click="getQueuePosition" class="btn btn-outline-dark">
          Ok
        </button>
      </div>
      <div class="col-12">
        <p class="text-center" :v-if="pos > 0">Posicion: {{ pos }}</p>
      </div>
    </div>
    <div></div>

    <div class="column-container">
      <h2>Cola en Espera</h2>
      <hr />
      <div class="d-grid mx-auto">
        <button @click="getToken" class="btn btn-outline-dark" type="button">
          {{ loadingGetToken ? "Cargando..." : "Entrar en la cola" }}
        </button>
      </div>
      <div class="item" v-for="(item, index) in waitingQueue" :key="index">
        {{ item }}
      </div>
    </div>
    <div class="column-container">
      <h2>Lista en proceso</h2>
      <hr />
      <div class="item" v-for="(item, index) in inProcessQueue" :key="index">
        {{ item }}
        <br />
        <div class="d-grid mx-auto mt-2">
          <button @click="pay(item)" class="btn btn-outline-dark" type="button">
            Pagar
          </button>
        </div>
      </div>
    </div>
    <div class="column-container">
      <h2>Tabla de ventas</h2>
      <hr />
      <div class="item" v-for="(item, index) in salesTableDynamo" :key="index">
        {{ item }}
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      waitingQueue: [],
      inProcessQueue: [],
      salesTableDynamo: [],
      intervalId: null,
      loadingGetToken: false,
      token: "",
      pos: null,
    };
  },
  mounted() {
    this.startInterval();
  },
  methods: {
    startInterval() {
      this.intervalId = setInterval(() => {
        axios.get("http://localhost:3000/get-memory-state").then((res) => {
          if (res.data.message) {
            console.log(res.data);
            this.waitingQueue = [...res.data.message.waitingQueue];
            this.inProcessQueue = [...res.data.message.inProcessQueue];
            this.salesTableDynamo = [
              ...res.data.message.salesTableDynamo.Items,
            ];
          }
        });
      }, 3000);
    },
    beforeDestroy() {
      clearInterval(this.intervalId);
    },
    async getQueuePosition() {
      const posResult = await axios.get(
        `http://localhost:3000/get-check-waiting-queue/${this.token}`
      );
      console.log(posResult);
      console.log(
        posResult.data.message.positionOnWaitingQueue !== null &&
          posResult.data.message.positionOnWaitingQueue !== undefined
      );
      if (
        posResult.data.message.positionOnWaitingQueue !== null &&
        posResult.data.message.positionOnWaitingQueue !== undefined
      ) {
        this.pos = posResult.data.message.positionOnWaitingQueue + 1;
      } else {
        this.pos = "Invalido";
      }
    },
    pay(tokenForPayment) {
      return axios.get(
        `http://localhost:3000/make-payment/${tokenForPayment}?email=rodrigo@gmail.com`
      );
    },
    async getToken() {
      this.loadingGetToken = true;
      const result = await axios.get(
        "http://localhost:3000/get-into-waiting-queue"
      );
      console.log(result);
      this.loadingGetToken = false;
    },
  },
};

// const count = ref(0);
// let token = "";
// let waitingQueue = defineModel([]);
// let inProcessQueue = defineModel([]);
// let salesTableDynamo = defineModel([]);

// async function pay() {
//   return axios
//     .post(
//       `http://localhost:3000/make-payment/${token}?email=rodrigo@gmail.com`,
//       {
//         token,
//       }
//     )
//     .then((res) => {
//       console.log(res.data);
//     });
// }

// async function getToken() {
//   const result = await axios.get(
//     "http://localhost:3000/get-into-waiting-queue"
//   );
//   console.log(result);
// }

// setInterval(() => {
//   axios.get("http://localhost:3000/get-memory-state").then((res) => {
//     if (res.data.message) {
//       console.log(res.data);
//       waitingQueue = [...res.data.message.waitingQueue];
//       inProcessQueue = [...res.data.message.inProcessQueue];
//       salesTableDynamo = [...res.data.message.salesTableDynamo.Items];
//     }
//   });
// }, 3000);
</script>

<style scoped>
.global-container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  padding: 1rem;
}

.global-container .column-container {
  background-color: #f0f0f0;
  padding: 3rem;
  color: black;
}

.item {
  background-color: #ffffff;
  padding: 1rem;
  margin-top: 1rem;
  margin-bottom: 1rem;
  min-width: 15rem;
  text-align: center;
}
</style> 
