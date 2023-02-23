import router from '@/router';

const DEFAULT_LIMITE = 5;
const DEFAULT_TOTAL = 0;
const DEFAULT_PAGINA_ACTIVA = 1;
const DEFAULT_WITH_TRASHED = false;
export const DEFAULT_TABLA_PAGINACION = [5, 10, 20, 40];

const positivoOZero = (val) => {
  const numberOrNaN = +val;

  if (Number.isInteger(numberOrNaN)) {
    return numberOrNaN;
  }

  return 0;
};

const parsearBooleano = (val) => {
  if (typeof val === 'boolean') {
    return val;
  }

  if (['true', 'false'].includes(val)) {
    return val === 'true';
  }

  return false;
};

function parsePage(pag) {
  return positivoOZero(pag) || DEFAULT_PAGINA_ACTIVA;
}

function parseLimit(limite) {
  if (DEFAULT_TABLA_PAGINACION.includes(positivoOZero(limite))) {
    return positivoOZero(limite);
  }
  return DEFAULT_LIMITE;
}

function parseWithTrashed(eliminados) {
  return parsearBooleano(eliminados) || DEFAULT_WITH_TRASHED;
}

function parseTotal(total) {
  return Number.parseInt(total, 10) || DEFAULT_WITH_TRASHED;
}

const asociacionClaves = {
  page: parsePage,
  limit: parseLimit,
  withTrashed: parseWithTrashed,
  total: parseTotal,
};

function obtenerValoresQueryUrl() {
  const { pag, limite, eliminados } = router.history.current.query;

  const page = parsePage(pag);
  const limit = parseLimit(limite);
  const withTrashed = parseWithTrashed(eliminados);

  return { page, limit, withTrashed };
}

function clavesStorePermitidas(key) {
  return ['page', 'limit', 'withTrashed', 'total'].includes(key);
}

function clavesPermitidasDelEstado(payload) {
  if (typeof payload !== 'object') {
    return {};
  }

  const opcionesFiltradas = Object.entries(payload)
    .filter(([key]) => clavesStorePermitidas(key))
    .map(([key, value]) => [key, asociacionClaves[key](value)]);

  return Object.fromEntries(opcionesFiltradas);
}

export default {
  namespaced: true,

  state: () => ({
    page: DEFAULT_PAGINA_ACTIVA,
    limit: DEFAULT_LIMITE,
    withTrashed: DEFAULT_WITH_TRASHED,
    total: DEFAULT_TOTAL,
  }),

  mutations: {
    resetPaginationAndTrashed(state) {
      const { page, limit, withTrashed } = obtenerValoresQueryUrl();

      state.page = page;
      state.limit = limit;
      state.withTrashed = withTrashed;
      state.total = DEFAULT_TOTAL;

      router.push(
        {
          query: {
            ...router.history.current.query,
            pag: page,
            limite: limit,
            eliminados: withTrashed,
          },
        },
        () => {},
      );
    },

    actualizarQuery(state, payload) {
      const nuevaQuery = clavesPermitidasDelEstado(payload);
      // eslint-disable-next-line no-restricted-syntax
      for (const [key, value] of Object.entries(nuevaQuery)) {
        state[key] = value;
      }

      const queryConvertida = JSON.parse(
        JSON.stringify({
          pag: nuevaQuery.page,
          limite: nuevaQuery.limit,
          eliminados: nuevaQuery.withTrashed,
        }),
      );

      router.push(
        {
          query: {
            ...router.history.current.query,
            ...queryConvertida,
          },
        },
        () => {},
      );
    },
  },
};
