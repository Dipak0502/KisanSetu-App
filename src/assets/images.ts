// Centralized Asset Importer for Vite
// In Vite, static assets must be imported so they are bundled into /dist/assets/ with hashes.

import heroBanner from './images/hero_farmer_harvest_1791810189806.jpg';
import catVeggies from './images/category_organic_veggies_1791810205598.jpg';
import catFruits from './images/category_fresh_fruits_1791810218118.jpg';
import catGrains from './images/category_grains_pulses_1791813663506.jpg';
import catDairy from './images/category_dairy_grains_1791810231981.jpg';
import prodTomatoes from './images/product_fresh_tomatoes_1791813716507.jpg';
import prodMangoes from './images/product_alphonso_mangoes_1791813729139.jpg';
import prodGhee from './images/product_pure_cow_ghee_1791813746465.jpg';
import prodMooli from './images/product_white_radish_mooli_1791816217294.jpg';
import prodMethi from './images/product_fenugreek_methi_1791816228619.jpg';
import prodSweetPotato from './images/product_sweet_potato_1791816240027.jpg';
import prodGarlic from './images/product_fresh_garlic_1791816250227.jpg';
import prodCabbage from './images/product_green_cabbage_1791818337544.jpg';
import prodOkra from './images/product_green_okra_1791818353479.jpg';
import prodLemons from './images/product_fresh_lemons_1791818373654.jpg';
import prodCorn from './images/product_sweet_corn_1791818399457.jpg';

export const ASSET_IMAGES = {
  heroBanner,
  categories: {
    veggies: catVeggies,
    fruits: catFruits,
    grains: catGrains,
    dairy: catDairy,
  },
  products: {
    tomatoes: prodTomatoes,
    mangoes: prodMangoes,
    ghee: prodGhee,
    mooli: prodMooli,
    methi: prodMethi,
    sweetPotato: prodSweetPotato,
    garlic: prodGarlic,
    cabbage: prodCabbage,
    okra: prodOkra,
    lemons: prodLemons,
    corn: prodCorn,
  }
};
