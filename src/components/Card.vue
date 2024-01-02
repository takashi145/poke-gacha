<script setup>
import { computed, ref } from 'vue';
import noImage from '@/assets/no_image.png';

const { pokemon } = defineProps(['pokemon']);

const showPokemonDetails = ref(null);
const isFlipped = ref(false);

const ringColor = computed(() => {
  if (pokemon.is_mythical && isFlipped.value) return 'rainbow-ring ring-transparent';
  if (pokemon.is_legendary) return 'ring-yellow-600';
  if (pokemon.is_mega || pokemon.is_gmax) return 'ring-teal-400';
  return 'ring-gray-200';
});
</script>

<template>
  <div 
    class="col-span-6 md:col-span-2 w-40 bg-white cursor-pointer relative flex justify-center items-center mx-auto flex-col h-52"
    :class="[
      ringColor, 
      isFlipped ? 'transition-all scale-x-100 ring-2 shadow-xl' : '-scale-x-100 bg-gray-400 shadow'
    ]"
    @click="isFlipped ? showPokemonDetails = pokemon.id : isFlipped = true" 
  >
    <div v-if="isFlipped" class="w-full p-4 mx-auto flex justify-center flex-col items-center">
      <div v-if="pokemon.is_shiny" class="absolute top-0 right-0 p-1">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6 text-yellow-400">
          <path fill-rule="evenodd" d="M9 4.5a.75.75 0 0 1 .721.544l.813 2.846a3.75 3.75 0 0 0 2.576 2.576l2.846.813a.75.75 0 0 1 0 1.442l-2.846.813a3.75 3.75 0 0 0-2.576 2.576l-.813 2.846a.75.75 0 0 1-1.442 0l-.813-2.846a3.75 3.75 0 0 0-2.576-2.576l-2.846-.813a.75.75 0 0 1 0-1.442l2.846-.813A3.75 3.75 0 0 0 7.466 7.89l.813-2.846A.75.75 0 0 1 9 4.5ZM18 1.5a.75.75 0 0 1 .728.568l.258 1.036c.236.94.97 1.674 1.91 1.91l1.036.258a.75.75 0 0 1 0 1.456l-1.036.258c-.94.236-1.674.97-1.91 1.91l-.258 1.036a.75.75 0 0 1-1.456 0l-.258-1.036a2.625 2.625 0 0 0-1.91-1.91l-1.036-.258a.75.75 0 0 1 0-1.456l1.036-.258a2.625 2.625 0 0 0 1.91-1.91l.258-1.036A.75.75 0 0 1 18 1.5ZM16.5 15a.75.75 0 0 1 .712.513l.394 1.183c.15.447.5.799.948.948l1.183.395a.75.75 0 0 1 0 1.422l-1.183.395c-.447.15-.799.5-.948.948l-.395 1.183a.75.75 0 0 1-1.422 0l-.395-1.183a1.5 1.5 0 0 0-.948-.948l-1.183-.395a.75.75 0 0 1 0-1.422l1.183-.395c.447-.15.799-.5.948-.948l.395-1.183A.75.75 0 0 1 16.5 15Z" clip-rule="evenodd" />
        </svg>
      </div>
      <img :src="pokemon.img ?? noImage" :alt="pokemon.name" class="w-32 mb-2">
      <h4 class="font-bold text-center">{{ pokemon.name }}</h4>
      <p v-if="pokemon.form != null" class="font-medium text-center text-sm">({{ pokemon.form }})</p>  
    </div>
  </div>

  <!-- ポケモン詳細表示モーダル -->
  <div v-if="showPokemonDetails == pokemon.id" class="mt-12 fixed inset-0 z-50">
      <div @click="showPokemonDetails = null" class="fixed inset-0 z-40 bg-black/30"></div>
      <div class="relative p-4 w-full z-50 mx-auto max-w-lg max-h-full overflow-auto">
          <div class="relative bg-white rounded-lg shadow pb-4">
            <div class="text-end">
              <button type="button" @click="showPokemonDetails = null" class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center">
                  <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                      <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                  </svg>
                  <span class="sr-only">Close modal</span>
              </button>
            </div>
            <div class="px-4">
              <div class="flex justify-center">
                <img :src="pokemon.img" alt="" class="w-64">
              </div>
              <div class="text-start">
                <div v-for="type in pokemon.types" :key="type" class="m-1 text-xs font-medium bg-gray-200 rounded inline-block py-1 px-2">
                  {{ type }}
                </div>
                <h4 class="font-bold flex items-center">
                  {{ pokemon.name }}
                  <span v-if="pokemon.form != null" class="ml-2">({{ pokemon.form }})</span>
                </h4>
                <p class="text-md p-1">{{ pokemon.flavor_text }}</p>
                <div class="border-t p-2">
                  高さ：{{ pokemon.height / 10 }} m <br>
                  重さ：{{ pokemon.weight / 10 }} kg
                </div>
              </div>
              
            </div>
          </div>
      </div>
  </div>
</template>

<style scoped>
.rainbow-ring {
  border: 2px solid;
  border-image: conic-gradient(#f5f551,#5eff5e,#84a1ff,#ff45ff,#ff5a5a,#ffbc41,#f5f551) 1;
}
</style>
