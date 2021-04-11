/**
 * Extend the basic ActorSheet with some very simple modifications
 * @extends {ActorSheet}
 */
export class SimpleActorSheet extends ActorSheet {

  /** @override */
	static get defaultOptions() {
	  return mergeObject(super.defaultOptions, {
  	  classes: ["worldbuilding", "sheet", "actor"],
  	  template: "systems/uesrpg-d100-modifie/templates/actor-sheet.html",
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
    if (this.actor.data.type == 'character') {
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
    let reussite_critique = this.actor.data.data.character.reussite_critique_max
    let echec_critique = this.actor.data.data.character.echec_critique_max

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
        if (roll.total <= reussite_critique) {
          const content = `Jet de <b>${element.name}</b>!
          <p></p><b>Stat actuelle: [[${wounded_char} + ${modifieur_stat} + ${playerInput}]]</b> <p></p>
          <b>Resultat: [[${roll.total}]]</b><p></p>
          <span style='font-size:120%;' class="rainbow"> <b>REUSSITE CRITIQUE !</b></span>`
          roll.toMessage({type: 4, user: game.user._id, speaker: ChatMessage.getSpeaker(), content: content});
    
        } else if (roll.total >= echec_critique) {
          const content = `Jet de <b>${element.name}</b>!
          <p></p><b>Stat actuelle: [[${wounded_char} + ${modifieur_stat} + ${playerInput}]]</b> <p></p>
          <b>Resultat: [[${roll.total}]]</b><p></p>
          <span style='color:red; font-size:120%;'> <b>ECHEC CRITIQUE !</b></span>`
          roll.toMessage({type: 4, user: game.user._id, speaker: ChatMessage.getSpeaker(), content: content});
    
        } else {
          const content = `Jet de <b>${element.name}</b>!
          <p></p><b>Stat actuelle: [[$${wounded_char} + ${modifieur_stat} + ${playerInput}]]</b> <p></p>
          <b>Resultat: [[${roll.total}]]</b><p></p>
          <b>${roll.total<=wounded_char ? " <span style='color:green; font-size: 120%;'> <b>REUSSITE !</b></span>" : " <span style='color:red; font-size: 120%;'> <b>ECHEC !</b></span>"}`
          roll.toMessage({type: 4, user: game.user._id, speaker: ChatMessage.getSpeaker(), content: content});
        } 
      } else {
      if (roll.total <= reussite_critique) {
        const content = `Jet de <b>${element.name}</b>!
        <p></p><b>Stat actuelle: [[${this.actor.data.data.characteristics[element.id].value} + ${this.actor.data.data.characteristics[element.id].modifieur} + ${playerInput}]]</b> <p></p>
        <b>Resultat: [[${roll.total}]]</b><p></p>
        <span style='font-size:120%;' class="rainbow"> <b>REUSSITE CRITIQUE !</b></span>`
        roll.toMessage({type: 4, user: game.user._id, speaker: ChatMessage.getSpeaker(), content: content});

      } else if (roll.total >= echec_critique) {
        const content = `Jet de <b>${element.name}</b>!
        <p></p><b>Stat actuelle: [[${this.actor.data.data.characteristics[element.id].value} + ${this.actor.data.data.characteristics[element.id].modifieur} + ${playerInput}]]</b> <p></p>
        <b>Resultat: [[${roll.total}]]</b><p></p>
        <span style='color:red; font-size:120%;'> <b>ECHEC CRITIQUE !</b></span>`
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

  _onSkillRoll(event) {
  event.preventDefault()
  const element = event.currentTarget
  
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
        
          if (roll.total <= 5) {
            const content = `Jet de <b>${element.name}</b>!
            <p></p><b>Stat actuelle: [[${this.actor.data.data.skills[element.id].tn}]]</b> <p></p>
            <b>Resultat: [[${roll.total}]]</b><p></p>
            <span style='font-size:120%;' class="rainbow"> <b>REUSSITE CRITIQUE !</b></span>`
        
            roll.toMessage({type: 4, user: game.user._id, speaker: ChatMessage.getSpeaker(), content: content});
        
          } else if (roll.total >= 96) {
            const content = `Jet de <b>${element.name}</b>!
            <p></p><b>Stat actuelle: [[${this.actor.data.data.skills[element.id].tn}]]</b> <p></p>
            <b>Resultat: [[${roll.total}]]</b><p></p>
            <span style='color:red; font-size:120%;'> <b>ECHEC CRITIQUE !</b></span>`
        
            roll.toMessage({type: 4, user: game.user._id, speaker: ChatMessage.getSpeaker(), content: content});
        
          } else {
            const content = `Jet de <b>${element.name}</b>!
            <p></p><b>Stat actuelle: [[${this.actor.data.data.skills[element.id].tn} + ${playerInput}]]</b> <p></p>
            <b>Resultat: [[${roll.total}]]</b><p></p>
            ${roll.total<=(this.actor.data.data.skills[element.id].tn + playerInput) ? " <span style='color:green; font-size: 120%;'> <b>REUSSITE !</b></span>" : " <span style='color:red; font-size: 120%;'> <b>ECHEC !</b></span>"}`
        
            roll.toMessage({type: 4, user: game.user._id, speaker: ChatMessage.getSpeaker(), content: content});
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

  _onMagicSkillRoll(event) {
    event.preventDefault()
    const element = event.currentTarget

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
      
        if (roll.total <= 5) {
          const content = `Jet de <b>${element.name}</b>!
          <p></p><b>Stat actuelle: [[${this.actor.data.data.magic_skills[element.id].tn} + ${playerInput}]]</b> <p></p>
          <b>Resultat: [[${roll.total}]]</b><p></p>
          <span style='font-size:120%;' class="rainbow"> <b>REUSSITE CRITIQUE !</b></span>`
          roll.toMessage({type: 4, user: game.user._id, speaker: ChatMessage.getSpeaker(), content: content});

        } else if (roll.total >= 96) {
          const content = `Jet de <b>${element.name}</b>!
          <p></p><b>Stat actuelle: [[${this.actor.data.data.magic_skills[element.id].tn} + ${playerInput}]]</b> <p></p>
          <b>Resultat: [[${roll.total}]]</b><p></p>
          <span style='color:red; font-size:120%;'> <b>ECHEC CRITIQUE !</b></span>`
          roll.toMessage({type: 4, user: game.user._id, speaker: ChatMessage.getSpeaker(), content: content});

        } else {
          const content = `Jet de <b>${element.name}</b>!
          <p></p><b>Stat actuelle: [[${this.actor.data.data.magic_skills[element.id].tn} + ${playerInput}]]</b> <p></p>
          <b>Resultat: [[${roll.total}]]</b><p></p>
          ${roll.total<=(this.actor.data.data.magic_skills[element.id].tn + playerInput) ? " <span style='color:green; font-size: 120%;'> <b>REUSSITE !</b></span>" : " <span style='color: red; font-size: 120%;'> <b>ECHEC !</b></span>"}`
          roll.toMessage({type: 4, user: game.user._id, speaker: ChatMessage.getSpeaker(), content: content});
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

  _onSpellRoll(event) {
    event.preventDefault()
    let button = $(event.currentTarget);
    const li = button.parents(".item");
    const item = this.actor.getOwnedItem(li.data("itemId"));

    let hit_loc = ""

    let roll = new Roll(item.data.data.damage);
    roll.roll();
    let hit = new Roll("1d10");
    hit.roll();

    if (hit.total <= 5) {
      hit_loc = "Body"
    } else if (hit.total == 6) {
      hit_loc = "Right Leg"
    } else if (hit.total == 7) {
      hit_loc = "Left Leg"
    } else if (hit.total == 8) {
      hit_loc = "Right Arm"
    } else if (hit.total == 9) {
      hit_loc = "Left Arm"
    } else if (hit.total == 10) {
      hit_loc = "Head"
    }

    const content = `Casts the spell <b>${item.name}!</b>
    <p></p>
    <b>Damage: [[${roll.total}]]</b> ${roll._formula}<b>
    <p></p>
    Hit Location: [[${hit.total}]]</b> ${hit_loc}<b>
    <p></p>
    MP Cost: [[${item.data.data.cost}]]
    <p></p>
    Attributes:</b> ${item.data.data.attributes}`

    roll.toMessage({type: 1, user: game.user._id, speaker: ChatMessage.getSpeaker(), content: content});
  }

  _onCombatRoll(event) {
    event.preventDefault()
    let button = $(event.currentTarget);
    const li = button.parents(".item");
    const item = this.actor.getOwnedItem(li.data("itemId"));

    let d = new Dialog({
      title: "Ajout modifieur",
      content: `<form>
                  <div class="dialogForm">
                  <label><b>${item.name} Modifieur: </b></label><input placeholder="ex. -20, +10" id="playerInput" value="0" style=" text-align: center; width: 50%; border-style: groove; float: right;" type="text"></input></div>
                </form>`,
      buttons: {
        one: {
          label: "Roll!",
          callback: html => {
            const playerInput = parseInt(html.find('[id="playerInput"]').val());

          let roll = new Roll("1d100");
          roll.roll();

          if (roll.total <= 5) {
            const content = `Rolls Combat Style <b>${item.name}</b>!
            <p></p><b>Stat actuelle: [[${item.data.data.value} + ${playerInput}]]</b> <p></p>
            <b>Resultat: [[${roll.total}]]</b><p></p>
            <span style='font-size:120%;' class="rainbow"> <b>REUSSITE CRITIQUE !</b></span>`
            roll.toMessage({type: 4, user: game.user._id, speaker: ChatMessage.getSpeaker(), content: content});

          } else if (roll.total >= 96) {
            const content = `Rolls Combat Style <b>${item.name}</b>!
            <p></p><b>Stat actuelle: [[${item.data.data.value} + ${playerInput}]]</b> <p></p>
            <b>Resultat: [[${roll.total}]]</b><p></p>
            <span style='color:red; font-size:120%;'> <b>ECHEC CRITIQUE !</b></span>`
            roll.toMessage({type: 4, user: game.user._id, speaker: ChatMessage.getSpeaker(), content: content});

          } else if (this.actor.data.data.wounded === true) {
            const content = `Rolls Combat Style <b>${item.name}</b>!
            <p></p><b>Stat actuelle: [[${item.data.data.value} + ${playerInput} + ${this.actor.data.data.woundPenalty}]]</b> <p></p>
            <b>Resultat: [[${roll.total}]]</b><p></p>
            <b>${roll.total<=(item.data.data.value + playerInput + this.actor.data.data.woundPenalty) ? " <span style='color:green; font-size: 120%;'> <b>REUSSITE !</b></span>" : " <span style='color: red; font-size: 120%;'> <b>ECHEC !</b></span>"}`
            roll.toMessage({type: 4, user: game.user._id, speaker: ChatMessage.getSpeaker(), content: content});

          } else {
            const content = `Rolls Combat Style <b>${item.name}</b>!
            <p></p><b>Stat actuelle: [[${item.data.data.value} + ${playerInput}]]</b> <p></p>
            <b>Resultat: [[${roll.total}]]</b><p></p>
            <b>${roll.total<=(item.data.data.value + playerInput) ? " <span style='color:green; font-size: 120%;'> <b>REUSSITE !</b></span>" : " <span style='color: red; font-size: 120%;'> <b>ECHEC !</b></span>"}`
            roll.toMessage({type: 4, user: game.user._id, speaker: ChatMessage.getSpeaker(), content: content});
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

      item.update({"data.value" : item.data.data.value});
  }

  _onResistanceRoll(event) {
    event.preventDefault()
    const element = event.currentTarget

    let d = new Dialog({
      title: "Ajout modifieur",
      content: `<form>
                  <div class="dialogForm">
                  <label><b>${element.name} Resistance Modifieur: </b></label><input placeholder="ex. -20, +10" id="playerInput" value="0" style=" text-align: center; width: 50%; border-style: groove; float: right;" type="text"></input></div>
                </form>`,
      buttons: {
        one: {
          label: "Roll!",
          callback: html => {
            const playerInput = parseInt(html.find('[id="playerInput"]').val());

          let roll = new Roll("1d100");
          roll.roll();

          if (roll.total <= 5) {
            const content = `Rolls Resistance for <b>${element.name}</b>!
            <p></p><b>Stat actuelle: [[${this.actor.data.data.resistance[element.id]} + ${playerInput}]]</b> <p></p>
            <b>Resultat: [[${roll.total}]]</b><p></p>
            <span style='font-size:120%;' class="rainbow"> <b>REUSSITE CRITIQUE !</b></span>`
            roll.toMessage({type: 4, user: game.user._id, speaker: ChatMessage.getSpeaker(), content: content});

          } else if (roll.total >= 96) {
            const content = `Rolls Resistance for <b>${element.name}</b>!
            <p></p><b>Stat actuelle: [[${this.actor.data.data.resistance[element.id]} + ${playerInput}]]</b> <p></p>
            <b>Resultat: [[${roll.total}]]</b><p></p>
            <span style='color:red; font-size:120%;'> <b>ECHEC CRITIQUE !</b></span>`
            roll.toMessage({type: 4, user: game.user._id, speaker: ChatMessage.getSpeaker(), content: content});

          } else {
            const content = `Rolls Resistance for <b>${element.name}</b>!
            <p></p><b>Stat actuelle: [[${this.actor.data.data.resistance[element.id]} + ${playerInput}]]</b> <p></p>
            <b>Resultat: [[${roll.total}]]</b><p></p>
            <b>${roll.total<=(this.actor.data.data.resistance[element.id] + playerInput) ? " <span style='color:green; font-size: 120%;'> <b>REUSSITE !</b></span>" : " <span style='color: red; font-size: 120%;'> <b>ECHEC !</b></span>"}`
            roll.toMessage({type: 4, user: game.user._id, speaker: ChatMessage.getSpeaker(), content: content});
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

  _onDamageRoll(event) {
    event.preventDefault()
    let button = $(event.currentTarget);
    const li = button.parents(".item");
    const item = this.actor.getOwnedItem(li.data("itemId"));

    let hit_loc = "";

    let hit = new Roll("1d10");
    hit.roll();

    if (hit.total <= 5) {
      hit_loc = "Body"
    } else if (hit.total == 6) {
      hit_loc = "Right Leg"
    } else if (hit.total == 7) {
      hit_loc = "Left Leg"
    } else if (hit.total == 8) {
      hit_loc = "Right Arm"
    } else if (hit.total == 9) {
      hit_loc = "Left Arm"
    } else if (hit.total == 10) {
      hit_loc = "Head"
    }

    let roll = new Roll(item.data.data.damage);
    let supRoll = new Roll(item.data.data.damage);
    let roll2H = new Roll(item.data.data.damage2);
    let supRoll2H = new Roll(item.data.data.damage2);
    roll.roll();
    supRoll.roll();
    roll2H.roll();
    supRoll2H.roll();

    if (item.data.data.weapon2H == true) {
      if (item.data.data.superior == true) {
        const content = `Rolls damage for their <b>${item.name}!</b>
          <p></p>
          <b>Damage:</b> <b> [[${roll2H.total}]] [[${supRoll2H.total}]]</b> ${roll2H._formula}<p></p>
          <b>Hit Location:</b> <b> [[${hit.total}]] </b> ${hit_loc}<p></p>
          <b>Qualities:</b> ${item.data.data.qualities}`
          roll.toMessage({type: 1, user: game.user._id, speaker: ChatMessage.getSpeaker(), content: content});

      } else {
          const content = `Rolls damage for their <b>${item.name}!</b>
            <p></p>
            <b>Damage:</b> <b> [[${roll2H.total}]]</b> ${roll2H._formula}<p></p>
            <b>Hit Location:</b> <b> [[${hit.total}]] </b> ${hit_loc}<p></p>
            <b>Qualities:</b> ${item.data.data.qualities}`
            roll.toMessage({type: 1, user: game.user._id, speaker: ChatMessage.getSpeaker(), content: content});
        }

    } else {
        if (item.data.data.superior == true) {
          const content = `Rolls damage for their <b>${item.name}!</b>
            <p></p>
            <b>Damage:</b> <b> [[${roll.total}]] [[${supRoll.total}]]</b> ${roll._formula}<p></p>
            <b>Hit Location:</b> <b> [[${hit.total}]] </b> ${hit_loc}<p></p>
            <b>Qualities:</b> ${item.data.data.qualities}`
            roll.toMessage({type: 1, user: game.user._id, speaker: ChatMessage.getSpeaker(), content: content});

      } else {
          const content = `Rolls damage for their <b>${item.name}!</b>
            <p></p>
            <b>Damage:</b> <b> [[${roll.total}]]</b> ${roll._formula}<p></p>
            <b>Hit Location:</b> <b> [[${hit.total}]] </b> ${hit_loc}<p></p>
            <b>Qualities:</b> ${item.data.data.qualities}`
            roll.toMessage({type: 1, user: game.user._id, speaker: ChatMessage.getSpeaker(), content: content});
          }
        }
  }
  
  _onArmorRoll(event) {
    event.preventDefault()
    let button = $(event.currentTarget);
    const li = button.parents(".item");
    const item = this.actor.getOwnedItem(li.data("itemId"));

    let roll = new Roll("1d10")
    roll.roll();

    const content = `<h2>${item.name}</h2><p>
      <b>AR:</b> ${item.data.data.armor}<p>
      <b>Magic AR:</b> ${item.data.data.magic_ar}<p>
      <b>Qualities</b> ${item.data.data.qualities}`
      roll.toMessage({type: 1, user: game.user._id, speaker: ChatMessage.getSpeaker(), content: content});
  }

  _onAmmoRoll(event) {
    event.preventDefault()
    let button = $(event.currentTarget);
    const li = button.parents(".item");
    const item = this.actor.getOwnedItem(li.data("itemId"));

    item.data.data.quantity = item.data.data.quantity - 1;
    item.update({"data.quantity" : item.data.data.quantity})

    let roll = new Roll("1d10")
    roll.roll();

    const content = `<h2>${item.name}</h2><p>
      <b>Damage Bonus:</b> ${item.data.data.damage}<p>
      <b>Qualities</b> ${item.data.data.qualities}`
      roll.toMessage({type: 1, user: game.user._id, speaker: ChatMessage.getSpeaker(), content: content});
  }

  _onToggle2H(event) {
    event.preventDefault()
    let toggle = $(event.currentTarget);
    const li = toggle.parents(".item");
    const item = this.actor.getOwnedItem(li.data("itemId"));

    if (item.data.data.weapon2H === false) {
      item.data.data.weapon2H = true;
    } else if (item.data.data.weapon2H === true) {
      item.data.data.weapon2H = false;
    }
    item.update({"data.weapon2H" : item.data.data.weapon2H})
  }

  _onPlusAmmo(event) {
    event.preventDefault()
    let toggle = $(event.currentTarget);
    const li = toggle.parents(".item");
    const item = this.actor.getOwnedItem(li.data("itemId"));

    item.data.data.quantity = item.data.data.quantity + 1;

    item.update({"data.quantity" : item.data.data.quantity})
  }

  _onMinusAmmo(event) {
    event.preventDefault()
    let toggle = $(event.currentTarget);
    const li = toggle.parents(".item");
    const item = this.actor.getOwnedItem(li.data("itemId"));

    item.data.data.quantity = item.data.data.quantity - 1;

    item.update({"data.quantity" : item.data.data.quantity})
  }

  _onItemEquip(event) {
    event.preventDefault()
    let toggle = $(event.currentTarget);
    const li = toggle.parents(".item");
    const item = this.actor.getOwnedItem(li.data("itemId"));

    if (item.data.data.equipped === false) {
      item.data.data.equipped = true;
    } else if (item.data.data.equipped === true) {
      item.data.data.equipped = false;
    }
    item.update({"data.equipped" : item.data.data.equipped})
  }

  _onItemCreate(event) {
    event.preventDefault()
    const element = event.currentTarget

    const itemData = {
      name: element.id,
      type: element.id,
    }

    this.actor.createOwnedItem(itemData);
  }

  _onTalentRoll(event) {
    event.preventDefault()
    let button = $(event.currentTarget);
    const li = button.parents(".item");
    const item = this.actor.getOwnedItem(li.data("itemId"));

    let roll = new Roll("1d10")
    roll.roll();

    const content = `<h2>${item.name}</h2><p>
    <i><b>${item.type}</b></i><p>
      <i>${item.data.data.description}</i>`
      roll.toMessage({typ: 1, user: game.user._id, speaker: ChatMessage.getSpeaker(), content: content});
  }

}
