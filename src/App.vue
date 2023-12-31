<script setup>
import { ref } from 'vue';
import axios from 'axios';

const pokemons = ref([]);
const isLoading = ref(false);

const getPokemonImage = (data, key) => {
  if (data.sprites[key]) {
    return data.sprites[key];
  }
  for (const source of Object.values(data.sprites.other)) {
    if (source[key]) {
      return source[key];
    }
  }
  return null;
}

const getPokemonJapaneseName = async (url) => {
  try {
    const response = await axios.get(url);
    const data = response.data;
    const japaneseName = data.names.find(name => name.language.name === 'ja-Hrkt');
    return japaneseName ? japaneseName.name : null;
  } catch (e) {
    return null;
  }
}

const drawGacha = async (gachaCount = 1) => {
  pokemons.value = [];
  isLoading.value = true;
  try {
    const response = await axios.get(`https://pokeapi.co/api/v2/pokemon?limit=100000&offset=0`);
    const data = response.data;
    const count = data.count;

    for (let i = 0; i < gachaCount; i++) {
      const pokemonIndex = Math.floor(Math.random() * count);
      const result = data.results[pokemonIndex];
      const detailsResponse = await axios.get(result.url);
      const detailsData = detailsResponse.data;

      const id = detailsData['id'];
      const name = await getPokemonJapaneseName(detailsData.species.url);
      const isShiny = Math.random() < 1 / 4096;
      const pokemonImg = getPokemonImage(detailsData, isShiny ? 'front_shiny' : 'front_default');
      
      pokemons.value.push({
        id: id,
        img: pokemonImg,
        name: name,
        isShiny: isShiny,
      });
    }
  } catch (e) {
    console.error(e);
  } finally {
    isLoading.value = false;
  }
}
</script>
<template>
  <header class="w-full shadow-lg p-3 z-50 bg-white">
    <h2 class="font-bold text-lg text-center">ポケガチャ</h2>
  </header>
  <div v-if="isLoading" class="z-50 fixed inset-0 flex justify-center items-center">
    <div class="animate-spin h-10 w-10 border-4 border-blue-500 rounded-full border-t-transparent"></div>
  </div>
  <div v-if="pokemons.length >= 1" class="pt-8 min-h-screen p-3">
    <ul class="mb-24 grid grid-cols-12 md:grid-cols-10 gap-8 justify-center items-center">
      <li 
        v-for="(pokemon, index) in pokemons"
        :key="index"
        :class="[!isLoading && pokemons.length == 1 ? 'col-span-12' : 'col-span-6 sm:col-span-4 md:col-span-2']"
        class="relative bg-gray-100 border rounded p-3 shadow-lg flex justify-center mx-auto flex-col"
      >
        <div v-if="pokemon.isShiny" class="absolute top-0 right-0 p-1">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6 text-yellow-400">
            <path fill-rule="evenodd" d="M9 4.5a.75.75 0 0 1 .721.544l.813 2.846a3.75 3.75 0 0 0 2.576 2.576l2.846.813a.75.75 0 0 1 0 1.442l-2.846.813a3.75 3.75 0 0 0-2.576 2.576l-.813 2.846a.75.75 0 0 1-1.442 0l-.813-2.846a3.75 3.75 0 0 0-2.576-2.576l-2.846-.813a.75.75 0 0 1 0-1.442l2.846-.813A3.75 3.75 0 0 0 7.466 7.89l.813-2.846A.75.75 0 0 1 9 4.5ZM18 1.5a.75.75 0 0 1 .728.568l.258 1.036c.236.94.97 1.674 1.91 1.91l1.036.258a.75.75 0 0 1 0 1.456l-1.036.258c-.94.236-1.674.97-1.91 1.91l-.258 1.036a.75.75 0 0 1-1.456 0l-.258-1.036a2.625 2.625 0 0 0-1.91-1.91l-1.036-.258a.75.75 0 0 1 0-1.456l1.036-.258a2.625 2.625 0 0 0 1.91-1.91l.258-1.036A.75.75 0 0 1 18 1.5ZM16.5 15a.75.75 0 0 1 .712.513l.394 1.183c.15.447.5.799.948.948l1.183.395a.75.75 0 0 1 0 1.422l-1.183.395c-.447.15-.799.5-.948.948l-.395 1.183a.75.75 0 0 1-1.422 0l-.395-1.183a1.5 1.5 0 0 0-.948-.948l-1.183-.395a.75.75 0 0 1 0-1.422l1.183-.395c.447-.15.799-.5.948-.948l.395-1.183A.75.75 0 0 1 16.5 15Z" clip-rule="evenodd" />
          </svg>
        </div>
        <p v-if="pokemon.img === null" class="text-gray-600 ">画像を取得できませんでした。</p>
        
        <div v-else class="flex justify-center">
          <img :src="pokemon.img" loading="lazy" alt="" class="w-36">  
        </div>

        <h4 class="font-bold text-center">{{ pokemon.name }}</h4>
      </li>
    </ul>
  </div>
  <div class="p-3 bg-white border-t border-gray-200 w-full fixed bottom-0 flex justify-center items-center space-x-8">
    <button @click="drawGacha(1)" class="text-white bg-blue-500 py-2 px-3 rounded shadow-lg hover:bg-blue-600">1連</button>
    <button @click="drawGacha(10)" class="text-white bg-blue-500 py-2 px-3 rounded shadow-lg hover:bg-blue-600">10連</button>
  </div>
</template>
