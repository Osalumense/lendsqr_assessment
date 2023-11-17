import 'isomorphic-fetch';
import { AppConfig } from "../../config/config"

const config = AppConfig.config

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('banks').del()
    const response = await fetch(`https://api.paystack.co/bank`, {
        method: 'GET',
        headers: {
        Accept: 'application/json',
              Authorization: `Bearer ${config.PAYSTACK_SECRET_KEY}`,
              'Content-Type': 'application/json'
          }
      })
      const r =await response.json()
      const data = r.data
      for(const bank of data){
        await knex('banks').insert({
          name: bank.name,
          code: bank.code
        })
      }
      console.log("Done inserting bank records")
};
