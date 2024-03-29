<script setup>
import { onMounted, ref } from 'vue';
import axios from 'axios';
import types from '@/data/type.json';
import Card from '@/components/Card.vue';

const SHINY_RATE = 1 / 4096;

const isLoading = ref(false);
const pokemonData = ref([]);
const pokemons = ref([]);

// 共通のAPIフェッチ関数
const fetchFromApi = async (url) => {
  try {
    const { data } = await axios.get(url);
    return data;
  } catch (error) {
    alert('エラーが発生しました。');
  }
}

const getJapaneseName = (names) => {
  const japaneseName = names.find(name => name.language.name === 'ja' || name.language.name === 'ja-Hrkt');
  return japaneseName ? japaneseName.name : null;
}

// ポケモンのタイプを日本語で取得
const getTypeJapaneseName = english_name => {
  const type = types.find(type => type.en === english_name);
  return type ? type.ja : english_name;
}

const getFlavorText = flavor_text_entries => {
  const result = flavor_text_entries.find(entry => entry.language.name === 'ja');
  return result != undefined 
    ? result.flavor_text.replace(/\s+/g,'') 
    : flavor_text_entries.length >= 1 ? flavor_text_entries[0].flavor_text : null;
}

// gachaCountの数だけランダムなポケモンを取得
const drawGacha = async (gachaCount = 1) => {
  if (!pokemonData) return;

  isLoading.value = true;
  pokemons.value = [];

  try {
    const pokemonsPromises = Array.from({ length: gachaCount }, async () => {
      return await drawSinglePokemon();
    });
    pokemons.value = await Promise.all(pokemonsPromises);
  } catch (error) {
    alert('エラーが発生しました。');
  } finally {
    isLoading.value = false;
  }
}

const drawSinglePokemon = async () => {
  const i = Math.floor(Math.random() * pokemonData.value.length);
  const selectedPokemon = pokemonData.value[i];
  const details = await fetchFromApi(selectedPokemon.url);
  const species = await fetchFromApi(details.species.url);
  const forms = await fetchFromApi(details.forms[0].url);

  const is_shiny = Math.random() < SHINY_RATE;

  return {
    id: details.id,
    name: getJapaneseName(species.names),
    form: getJapaneseName(forms.form_names),
    img: details.sprites.other['official-artwork'][is_shiny ? 'front_shiny' : 'front_default'],
    flavor_text: getFlavorText(species.flavor_text_entries),
    types: details.types.map(item => getTypeJapaneseName(item.type.name)),
    height: details.height,
    weight: details.weight,
    is_shiny: is_shiny,
    is_default: details.is_default,
    is_gmax: details.name.includes('-gmax'),
    is_mega: forms.is_mega,
    is_legendary: species.is_legendary,
    is_mythical: species.is_mythical,
  };
}

onMounted(() => {
  isLoading.value = true;
  setTimeout(async () => {
    try {
      const { results } = await fetchFromApi(`https://pokeapi.co/api/v2/pokemon?limit=100000&offset=0`);
      pokemonData.value = results;
    } finally {
      isLoading.value = false;
    }
  }, 1000);
});
</script>
<template>
  <div class="bg-white">
    <header class="w-full shadow-lg p-3 z-50 bg-yellow-300/80">
      <h2 class="font-bold font-mono text-lg text-center text-gray-800">ポケモンガチャ</h2>
    </header>
    
    <div v-if="isLoading" class="z-50 fixed inset-0 flex flex-col justify-center items-center">
      <div class="animate-spin h-10 w-10 border-4 border-blue-500 rounded-full border-t-transparent"></div>
    </div>

    <div class="max-w-7xl mx-auto pt-6 mb-24 w-full text-center">
      <h3 class="font-medium text-md sm:text-lg md:text-xl text-gray-800">ポケモンガチャで運試し！何が出るかな？</h3>
      <div class="p-3 flex items-center justify-center text-md">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6 text-yellow-400 mr-3">
          <path fill-rule="evenodd" d="M9 4.5a.75.75 0 0 1 .721.544l.813 2.846a3.75 3.75 0 0 0 2.576 2.576l2.846.813a.75.75 0 0 1 0 1.442l-2.846.813a3.75 3.75 0 0 0-2.576 2.576l-.813 2.846a.75.75 0 0 1-1.442 0l-.813-2.846a3.75 3.75 0 0 0-2.576-2.576l-2.846-.813a.75.75 0 0 1 0-1.442l2.846-.813A3.75 3.75 0 0 0 7.466 7.89l.813-2.846A.75.75 0 0 1 9 4.5ZM18 1.5a.75.75 0 0 1 .728.568l.258 1.036c.236.94.97 1.674 1.91 1.91l1.036.258a.75.75 0 0 1 0 1.456l-1.036.258c-.94.236-1.674.97-1.91 1.91l-.258 1.036a.75.75 0 0 1-1.456 0l-.258-1.036a2.625 2.625 0 0 0-1.91-1.91l-1.036-.258a.75.75 0 0 1 0-1.456l1.036-.258a2.625 2.625 0 0 0 1.91-1.91l.258-1.036A.75.75 0 0 1 18 1.5ZM16.5 15a.75.75 0 0 1 .712.513l.394 1.183c.15.447.5.799.948.948l1.183.395a.75.75 0 0 1 0 1.422l-1.183.395c-.447.15-.799.5-.948.948l-.395 1.183a.75.75 0 0 1-1.422 0l-.395-1.183a1.5 1.5 0 0 0-.948-.948l-1.183-.395a.75.75 0 0 1 0-1.422l1.183-.395c.447-.15.799-.5.948-.948l.395-1.183A.75.75 0 0 1 16.5 15Z" clip-rule="evenodd" />
        </svg>
        稀に色違いが出現！
      </div>

      <div v-if="!isLoading" class="mt-8 flex justify-center">
        <div class="grid" :class="[pokemons.length > 1 ? 'grid-cols-12 md:grid-cols-6 lg:grid-cols-10 gap-6 sm:gap-8' : 'justify-center items-center']">
          <Card 
            v-for="pokemon in pokemons" 
            :key="pokemon.id"
            :pokemon="pokemon"
          />
        </div>
      </div>
    </div>

    <div v-if="!isLoading" class="p-3 bg-yellow-200/80 border-t border-gray-200 w-full fixed bottom-0 flex justify-center items-center space-x-8">
      <button @click="drawGacha(1)" :disabled="isLoading" class="text-white bg-blue-500 py-2 px-3 rounded shadow-lg hover:bg-blue-600">1連</button>
      <button @click="drawGacha(5)" :disabled="isLoading" class="text-white bg-blue-500 py-2 px-4 rounded shadow-lg hover:bg-blue-600">5連</button>
    </div>  
  </div>
  
</template>
