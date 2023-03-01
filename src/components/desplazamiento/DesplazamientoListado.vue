<template>
  <div>
    <v-row>
      <v-col >
        <v-menu
          ref="menu1"
          v-model="menu1"
          :close-on-content-click="false"
          transition="scale-transition"
          offset-y
          max-width="290px"
          min-width="auto"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-text-field
              v-model="dateFormatted"
              label="Date"
              hint="MM/DD/YYYY format"
              persistent-hint
              prepend-icon="mdi-calendar"
              v-bind="attrs"
              @blur="date = parseDate(dateFormatted)"
              v-on="on"
            ></v-text-field>
          </template>
          <v-date-picker
            v-model="date"
            no-title
            @input="menu1 = false"
          ></v-date-picker>
        </v-menu>
        <p>
          Date in ISO format: <strong>{{ date }}</strong>
        </p>
      </v-col>

      <v-col >
        <v-menu
          v-model="menu2"
          :close-on-content-click="false"
          transition="scale-transition"
          offset-y
          max-width="290px"
          min-width="auto"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-text-field
              v-model="computedDateFormatted"
              label="Date (read only text field)"
              hint="MM/DD/YYYY format"
              persistent-hint
              prepend-icon="mdi-calendar"
              readonly
              v-bind="attrs"
              v-on="on"
            ></v-text-field>
          </template>
          <v-date-picker
            v-model="date"
            no-title
            @input="menu2 = false"
          ></v-date-picker>
        </v-menu>
        <p>
          Date in ISO format: <strong>{{ date }}</strong>
        </p>
      </v-col>
      <v-col> <v-btn color="primary"> Filtrar </v-btn></v-col>
    </v-row>
    <v-row>
      <div class="text-center">
        <v-pagination
          v-model="page"
          :length="6"
        ></v-pagination>
      </div>
    </v-row>
    <v-row>
      <v-col>
        <v-card>
          <v-card-title class="my-0 py-0">
            22a3e45f-343e-4308-b42b-0cc2fe05873f
          </v-card-title>
          <v-card-text>
            <v-list class="transparent">
              <v-list-item
                v-for="item in forecast"
                :key="item.day"
                class="my-0 py-0"
              >
                <v-list-item-title>{{ item.day }}</v-list-item-title>

                <v-list-item-icon>
                  <v-icon>{{ item.icon }}</v-icon>
                </v-list-item-icon>

                <v-list-item-subtitle class="text-right">
                  {{ item.temp }}
                </v-list-item-subtitle>
              </v-list-item>
            </v-list>
          </v-card-text>
          <v-card-actions class="my-0 py-0">
            <v-btn text> Ver detalle </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
      <v-col>
        <v-card>
          <v-card-title class="my-0 py-0">
            22a3e45f-343e-4308-b42b-0cc2fe05873f
          </v-card-title>
          <v-card-text>
            <v-list class="transparent">
              <v-list-item
                v-for="item in forecast"
                :key="item.day"
                class="my-0 py-0"
              >
                <v-list-item-title>{{ item.day }}</v-list-item-title>

                <v-list-item-icon>
                  <v-icon>{{ item.icon }}</v-icon>
                </v-list-item-icon>

                <v-list-item-subtitle class="text-right">
                  {{ item.temp }}
                </v-list-item-subtitle>
              </v-list-item>
            </v-list>
          </v-card-text>
          <v-card-actions class="my-0 py-0">
            <v-btn text> Ver detalle </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>

      <v-col>
        <v-card>
          <v-card-title class="my-0 py-0">
            22a3e45f-343e-4308-b42b-0cc2fe05873f
          </v-card-title>
          <v-card-text>
            <v-list class="transparent">
              <v-list-item
                v-for="item in forecast.slice(2)"
                :key="item.day"
                class="my-0 py-0"
              >
                <v-list-item-title>{{ item.day }}</v-list-item-title>

                <v-list-item-icon>
                  <v-icon>{{ item.icon }}</v-icon>
                </v-list-item-icon>

                <v-list-item-subtitle class="text-right">
                  {{ item.temp }}
                </v-list-item-subtitle>
              </v-list-item>
            </v-list>
          </v-card-text>
          <v-card-actions class="my-0 py-0">
            <v-btn text> Ver detalle </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>

      <v-col>
        <v-card>
          <v-card-title class="my-0 py-0">
            22a3e45f-343e-4308-b42b-0cc2fe05873f
          </v-card-title>
          <v-card-text>
            <v-list class="transparent">
              <v-list-item
                v-for="item in forecast.slice(1)"
                :key="item.day"
                class="my-0 py-0"
              >
                <v-list-item-title>{{ item.day }}</v-list-item-title>

                <v-list-item-icon>
                  <v-icon>{{ item.icon }}</v-icon>
                </v-list-item-icon>

                <v-list-item-subtitle class="text-right">
                  {{ item.temp }}
                </v-list-item-subtitle>
              </v-list-item>
            </v-list>
          </v-card-text>
          <v-card-actions class="my-0 py-0">
            <v-btn text> Ver detalle </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>
<script>
export default {
  name: 'DesplazamientoListado',

  components: {},
  data() {
    return {
      forecast: [
        {
          day: 'Caminando',
          icon: 'mdi-walk',
          temp: '36 minutos',
        },
        {
          day: 'Autobus',
          icon: 'mdi-bus',
          temp: '7 minutos',
        },
        { day: 'Carro', icon: 'mdi-car', temp: '15 minutos' },
        { day: 'Total', icon: 'mdi-sigma', temp: '58 minutos' },
      ],
    };
  },
};
</script>
