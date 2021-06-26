/**
 * Extend the basic ActorSheet with some very simple modifications
 * @extends {ActorSheet}
 */
 export class familierSheet extends ActorSheet {

    /** @override */
      static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
          classes: ["worldbuilding", "sheet", "actor", "familier"],
          template: "systems/uesrpg-d100-modifie/templates/familier-sheet.php",
        width: 600,
        height: 600,
        tabs: [{navSelector: ".sheet-tabs", contentSelector: ".sheet-body", initial: "description"}],
        dragDrop: [{dragSelector: [".item-list .item", ".combat-list .item", ".ability-list .item", ".spell-list .item"], dropSelector: null}]
      });
    }
  
    /* -------------------------------------------- */
  
    /** @override */
    getData() {
      const  data = super.getData(); 
      data.dtypes = ["String", "Number", "Boolean"];
  
      // Prepare Items
      if (this.actor.data.type == 'familier') {
        this._prepareCharacterItems(data);
      }
  
      return data;
      }
  
      _prepareCharacterItems(sheetData) {
        const actorData = sheetData.actor;
  
        //Initialize containers
        const gear = [];
        const weapon = [];
        const armor = {
          Equipped: [],
          Unequipped: []
        };
        const power = [];
        const trait = [];
        const talent = [];
        const combatStyle = [];
        const spell = {
          alteration: [],
          conjuration: [],
          destruction: [],
          illusion: [],
          mysticism: [],
          necromancy: [],
          restoration: []
        };
        const ammunition = [];
  
        //Iterate through items, allocating to containers
        //let totaWeight = 0;
        for (let i of sheetData.items) {
          let item = i.data;
          i.img = i.img || DEFAULT_TOKEN;
          //Append to item
          if (i.type === 'item') {
            gear.push(i);
          }
          //Append to weapons
          else if (i.type === 'weapon') {
              weapon.push(i);
          }
          //Append to armor
          else if (i.type === 'armor') {
            if (i.data.equipped === true) {
            armor.Equipped.push(i);
            } else {
              armor.Unequipped.push(i);
            }
          }
          //Append to power
          else if (i.type === 'power') {
            power.push(i);
          }
          //Append to trait
          else if (i.type === 'trait') {
            trait.push(i);
          }
          //Append to talent
          else if (i.type === 'talent') {
            talent.push(i);
          }
          //Append to combatStyle
          else if (i.type === 'combatStyle') {
            combatStyle.push(i);
          }
          //Append to spell
          else if (i.type === 'spell') {
            if (i.data.school != undefined) {
              spell[i.data.school].push(i);
            }
          }
          //Append to ammunition
          else if (i.type === 'ammunition') {
            ammunition.push(i);
          }
        }
  
        //Assign and return
        actorData.gear = gear;
        actorData.weapon = weapon;
        actorData.armor = armor;
        actorData.power = power;
        actorData.trait = trait;
        actorData.talent = talent;
        actorData.combatStyle = combatStyle;
        actorData.spell = spell;
        actorData.ammunition = ammunition;
  
      }
  
    /* -------------------------------------------- */
  
    /** @override */
      activateListeners(html) {
      super.activateListeners(html);
  
      // Rollable Buttons
      html.find(".characteristic-roll").click(this._onClickCharacteristic.bind(this));
      html.find(".magic-skill-roll").click(this._onMagicSkillRoll.bind(this));
      html.find(".combat-roll").click(this._onCombatRoll.bind(this));
      html.find(".magic-roll").click(this._onSpellRoll.bind(this));
      html.find(".resistance-roll").click(this._onResistanceRoll.bind(this));
      html.find(".damage-roll").click(this._onDamageRoll.bind(this));
      html.find(".armor-roll").click(this._onArmorRoll.bind(this));
      html.find(".ammo-roll").click(this._onAmmoRoll.bind(this));
      html.find(".ability-list .item-img").click(this._onTalentRoll.bind(this));
  
      //Update Item Attributes from Actor Sheet
      html.find(".toggle2H").click(this._onToggle2H.bind(this));
      html.find(".ammo-plus").click(this._onPlusAmmo.bind(this));
      html.find(".ammo-minus").click(this._onMinusAmmo.bind(this));
      html.find(".itemEquip").click(this._onItemEquip.bind(this));
  
      //Item Create Buttons
      html.find(".combat-create").click(this._onItemCreate.bind(this));
      html.find(".weapon-create").click(this._onItemCreate.bind(this));
      html.find(".ammo-create").click(this._onItemCreate.bind(this));
      html.find(".armor-create").click(this._onItemCreate.bind(this));
      html.find(".gear-create").click(this._onItemCreate.bind(this));
      html.find(".trait-create").click(this._onItemCreate.bind(this));
      html.find(".power-create").click(this._onItemCreate.bind(this));
      html.find(".talent-create").click(this._onItemCreate.bind(this));
  
      // Everything below here is only needed if the sheet is editable
      if (!this.options.editable) return;
  
      // Update Inventory Item
      html.find('.item-edit').click(ev => {
        const li = $(ev.currentTarget).parents(".item");
        const item = this.actor.getOwnedItem(li.data("itemId"));
        item.sheet.render(true);
      });
  
      html.find('.item-name').click(ev => {
        const li = $(ev.currentTarget).parents(".item");
        const item = this.actor.getOwnedItem(li.data("itemId"));
        item.sheet.render(true);
        item.update({"data.value" : item.data.data.value})
      });
  
      // Delete Inventory Item
      html.find('.item-delete').click(ev => {
        const li = $(ev.currentTarget).parents(".item");
        this.actor.deleteOwnedItem(li.data("itemId"));
        li.slideUp(200, () => this.render(false));
      });
  
    }
  
    /**
     * Handle clickable rolls.
     * @param {Event} event   The originating click event
     * @private
     */
  
    _onClickCharacteristic(event) {
      event.preventDefault()
      const element = event.currentTarget
      let wounded_char = this.actor.data.data.characteristics[element.id].value - 20
      let modifieur_stat = this.actor.data.data.characteristics[element.id].modifieur
      let reussite_critique = this.actor.data.data.reussite_critique_max
      let echec_critique = this.actor.data.data.echec_critique_max
      let reussite_ultime = 1
      let echec_ultime = 100
  
      let d = new Dialog({
        title: "Ajout modifieur",
        content: `<form>
                    <div class="dialogForm">
                    <label><b>${element.name} Modifieur: </b></label><input placeholder="ex. -20, +10" id="playerInput" value="0" style=" text-align: center; width: 50%; border-style: groove; float: right;" type="text"></input></div>
                  </form>`,
        buttons: {
          one: {
            label: "Roll!",
            callback: html => {
              const playerInput = parseInt(html.find('[id="playerInput"]').val());
  
      let roll = new Roll("1d100");
      roll.roll();
  
        if (this.actor.data.data.wounded == true) {
          if (roll.total <= reussite_ultime) {
            const content = `Jet de <b>${element.name}</b>!
            <p></p><b>Stat actuelle: [[${wounded_char} + ${modifieur_stat} + ${playerInput}]]</b> <p></p>
            <b>Resultat: [[${roll.total}]]</b><p></p>
            <span style='font-size:120%;' class="rainbowRU"> <b>REUSSITE ULTIME !</b></span>`
            roll.toMessage({type: 4, user: game.user._id, speaker: ChatMessage.getSpeaker(), content: content});
  
          } else if (roll.total >= echec_ultime) {
            const content = `Jet de <b>${element.name}</b>!
            <p></p><b>Stat actuelle: [[${wounded_char} + ${modifieur_stat} + ${playerInput}]]</b> <p></p>
            <b>Resultat: [[${roll.total}]]</b><p></p>
            <span style='font-size:120%;' class="rainbowEU"> <b>ECHEC ULTIME !</b></span>`
            roll.toMessage({type: 4, user: game.user._id, speaker: ChatMessage.getSpeaker(), content: content});
          
          } else if (roll.total <= reussite_critique) {
            const content = `Jet de <b>${element.name}</b>!
            <p></p><b>Stat actuelle: [[${wounded_char} + ${modifieur_stat} + ${playerInput}]]</b> <p></p>
            <b>Resultat: [[${roll.total}]]</b><p></p>
            <span style='font-size:120%;' class="rainbowRC"> <b>REUSSITE CRITIQUE !</b></span>`
            roll.toMessage({type: 4, user: game.user._id, speaker: ChatMessage.getSpeaker(), content: content});
  
          } else if (roll.total >= echec_critique) {
            const content = `Jet de <b>${element.name}</b>!
            <p></p><b>Stat actuelle: [[${wounded_char} + ${modifieur_stat} + ${playerInput}]]</b> <p></p>
            <b>Resultat: [[${roll.total}]]</b><p></p>
            <span style='font-size:120%;' class="rainbowEC"> <b>ECHEC CRITIQUE !</b></span>`
            roll.toMessage({type: 4, user: game.user._id, speaker: ChatMessage.getSpeaker(), content: content});
      
          } else {
            const content = `Jet de <b>${element.name}</b>!
            <p></p><b>Stat actuelle: [[$${wounded_char} + ${modifieur_stat} + ${playerInput}]]</b> <p></p>
            <b>Resultat: [[${roll.total}]]</b><p></p>
            <b>${roll.total<=wounded_char ? " <span style='color:green; font-size: 120%;'> <b>REUSSITE !</b></span>" : " <span style='color:red; font-size: 120%;'> <b>ECHEC !</b></span>"}`
            roll.toMessage({type: 4, user: game.user._id, speaker: ChatMessage.getSpeaker(), content: content});
          } 
        } else {
        if (roll.total <= reussite_ultime) {
          const content = `Jet de <b>${element.name}</b>!
          <p></p><b>Stat actuelle: [[${this.actor.data.data.characteristics[element.id].value} + ${this.actor.data.data.characteristics[element.id].modifieur} + ${playerInput}]]</b> <p></p>
          <b>Resultat: [[${roll.total}]]</b><p></p>
          <span style='font-size:120%;' class="rainbowRU"> <b>REUSSITE ULTIME !</b></span>`
          roll.toMessage({type: 4, user: game.user._id, speaker: ChatMessage.getSpeaker(), content: content});
  
        } else if (roll.total >= echec_ultime) {
          const content = `Jet de <b>${element.name}</b>!
          <p></p><b>Stat actuelle: [[${this.actor.data.data.characteristics[element.id].value} + ${this.actor.data.data.characteristics[element.id].modifieur} + ${playerInput}]]</b> <p></p>
          <b>Resultat: [[${roll.total}]]</b><p></p>
          <span style='font-size:120%;' class="rainbowEU"> <b>ECHEC ULTIME !</b></span>`
          roll.toMessage({type: 4, user: game.user._id, speaker: ChatMessage.getSpeaker(), content: content});
  
        } else if (roll.total <= reussite_critique) {
          const content = `Jet de <b>${element.name}</b>!
          <p></p><b>Stat actuelle: [[${this.actor.data.data.characteristics[element.id].value} + ${this.actor.data.data.characteristics[element.id].modifieur} + ${playerInput}]]</b> <p></p>
          <b>Resultat: [[${roll.total}]]</b><p></p>
          <span style='font-size:120%;' class="rainbowRC"> <b>REUSSITE CRITIQUE !</b></span>`
          roll.toMessage({type: 4, user: game.user._id, speaker: ChatMessage.getSpeaker(), content: content});
  
        } else if (roll.total >= echec_critique) {
          const content = `Jet de <b>${element.name}</b>!
          <p></p><b>Stat actuelle: [[${this.actor.data.data.characteristics[element.id].value} + ${this.actor.data.data.characteristics[element.id].modifieur} + ${playerInput}]]</b> <p></p>
          <b>Resultat: [[${roll.total}]]</b><p></p>
          <span style='font-size:120%;' class="rainbowEC"> <b>ECHEC CRITIQUE !</b></span>`
          roll.toMessage({type: 4, user: game.user._id, speaker: ChatMessage.getSpeaker(), content: content});
  
        } else {
          const content = `Jet de <b>${element.name}</b>!
          <p></p><b>Stat actuelle: [[${this.actor.data.data.characteristics[element.id].value} + ${this.actor.data.data.characteristics[element.id].modifieur} + ${playerInput}]]</b> <p></p>
          <b>Resultat: [[${roll.total}]]</b><p></p>
          <b>${roll.total<=(this.actor.data.data.characteristics[element.id].value + this.actor.data.data.characteristics[element.id].modifieur + playerInput) ? " <span style='color:green; font-size: 120%;'> <b>REUSSITE !</b></span>" : " <span style='color:red; font-size: 120%;'> <b>ECHEC !</b></span>"}`
          roll.toMessage({type: 4, user: game.user._id, speaker: ChatMessage.getSpeaker(), content: content});
        }
      } 
      }
    },
    two: {
      label: "Cancel",
      callback: html => console.log("Cancelled")
    }
    },
    default: "one",
    close: html => console.log()
    });
    d.render(true);
    }

  
  }
  