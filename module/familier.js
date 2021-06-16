/**
 * Extend the base Familier entity by defining a custom roll data structure which is ideal for the Simple system.
 * @extends {Familier}
 */
 export class SimpleFamilier extends Familier {

    prepareData() {
      super.prepareData();
  
      const familierData = this.data;
      const data = familierData.data;
      const flags = familierData.flags;
  
      // Make separate methods for each Familier type (character, npc, etc.) to keep
      // things organized.
      if (familierData.type === 'character') this._prepareCharacterData(familierData);
    }
  
    /**
     * Prepare Character type specific data
     */
    _prepareCharacterData(familierData) {
      const data = familierData.data;
  
      //Characteristic Bonuses
      
      var forBonus = Math.floor(data.characteristics.for.value / 10);
      var endBonus = Math.floor(data.characteristics.end.value / 10);
      var agiBonus = Math.floor(data.characteristics.agi.value / 10);
      var intBonus = Math.floor(data.characteristics.int.value / 10);
      var perBonus = Math.floor(data.characteristics.per.value / 10);
      var prsBonus = Math.floor(data.characteristics.prs.value / 10);
      var socBonus = Math.floor(data.characteristics.soc.value / 10);
    }

    _hpBonus(familierData) {
      let attribute = familierData.items.filter(item => item.data.hasOwnProperty("hpBonus"));
      let bonus = 0;
      for (let item of attribute) {
        bonus = bonus + item.data.hpBonus;
      }
      return bonus
    }
  
    _iniCalc(familierData) {
      let init = familierData.data.initiative.base;
        
          if (item.data.replace.ini.iniToggle == true) {
            if (item.data.replace.ini.characteristic == "for") {
              init = Math.floor(familierData.data.characteristics.for.value / 10) * 3;
            } else if (item.data.replace.ini.characteristic == "end") {
              init = Math.floor(familierData.data.characteristics.end.value / 10) * 3;
            } else if (item.data.replace.ini.characteristic == "agi") {
              init = Math.floor(familierData.data.characteristics.agi.value / 10) * 3;
            } else if (item.data.replace.ini.characteristic == "int") {
              init = Math.floor(familierData.data.characteristics.int.value / 10) * 3;
            } else if (item.data.replace.ini.characteristic == "per") {
              init = Math.floor(familierData.data.characteristics.per.value / 10) * 3;
            } else if (item.data.replace.ini.characteristic == "prs") {
              init = Math.floor(familierData.data.characteristics.prs.value / 10) * 3;
            } else if (item.data.replace.ini.characteristic == "soc") {
              init = Math.floor(familierData.data.characteristics.soc.value / 10) * 3;
            } 
          }
        }
  
  }
  