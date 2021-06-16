/**
 * Extend the basic ActorSheet with some very simple modifications
 * @extends {FamilierSheet}
 */
 export class SimpleFamilierSheet extends FamilierSheet {

    /** @override */
      static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
          classes: ["worldbuilding", "sheet", "familier"],
          template: "systems/uesrpg-d100-modifie/templates/familier-sheet.html",
        width: 600,
        height: 600,
        tabs: [{navSelector: ".sheet-tabs", contentSelector: ".sheet-body", initial: "description"}],
        dragDrop: [{dragSelector: [".item-list .item", ".combat-list .item", ".ability-list .item", ".spell-list .item"], dropSelector: null}]
      });
    }
  
    /* -------------------------------------------- */
  
    
    /* -------------------------------------------- */
  
    /** @override */
      activateListeners(html) {
      super.activateListeners(html);
  
      // Rollable Buttons
      html.find(".characteristic-roll").click(this._onClickCharacteristic.bind(this));
  
      // Everything below here is only needed if the sheet is editable
      if (!this.options.editable) return;
  
  
    }
  
    /**
     * Handle clickable rolls.
     * @param {Event} event   The originating click event
     * @private
     */
  
    _onClickCharacteristic(event) {
      event.preventDefault()
      const element = event.currentTarget
      let wounded_char = this.familier.data.data.characteristics[element.id].value - 20
      let modifieur_stat = this.familier.data.data.characteristics[element.id].modifieur
      let reussite_critique = this.familier.data.data.reussite_critique_max
      let echec_critique = this.familier.data.data.echec_critique_max
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
  
        if (this.familier.data.data.wounded == true) {
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
          <p></p><b>Stat actuelle: [[${this.familier.data.data.characteristics[element.id].value} + ${this.familier.data.data.characteristics[element.id].modifieur} + ${playerInput}]]</b> <p></p>
          <b>Resultat: [[${roll.total}]]</b><p></p>
          <span style='font-size:120%;' class="rainbowRU"> <b>REUSSITE ULTIME !</b></span>`
          roll.toMessage({type: 4, user: game.user._id, speaker: ChatMessage.getSpeaker(), content: content});
  
        } else if (roll.total >= echec_ultime) {
          const content = `Jet de <b>${element.name}</b>!
          <p></p><b>Stat actuelle: [[${this.familier.data.data.characteristics[element.id].value} + ${this.familier.data.data.characteristics[element.id].modifieur} + ${playerInput}]]</b> <p></p>
          <b>Resultat: [[${roll.total}]]</b><p></p>
          <span style='font-size:120%;' class="rainbowEU"> <b>ECHEC ULTIME !</b></span>`
          roll.toMessage({type: 4, user: game.user._id, speaker: ChatMessage.getSpeaker(), content: content});
  
        } else if (roll.total <= reussite_critique) {
          const content = `Jet de <b>${element.name}</b>!
          <p></p><b>Stat actuelle: [[${this.familier.data.data.characteristics[element.id].value} + ${this.familier.data.data.characteristics[element.id].modifieur} + ${playerInput}]]</b> <p></p>
          <b>Resultat: [[${roll.total}]]</b><p></p>
          <span style='font-size:120%;' class="rainbowRC"> <b>REUSSITE CRITIQUE !</b></span>`
          roll.toMessage({type: 4, user: game.user._id, speaker: ChatMessage.getSpeaker(), content: content});
  
        } else if (roll.total >= echec_critique) {
          const content = `Jet de <b>${element.name}</b>!
          <p></p><b>Stat actuelle: [[${this.familier.data.data.characteristics[element.id].value} + ${this.familier.data.data.characteristics[element.id].modifieur} + ${playerInput}]]</b> <p></p>
          <b>Resultat: [[${roll.total}]]</b><p></p>
          <span style='font-size:120%;' class="rainbowEC"> <b>ECHEC CRITIQUE !</b></span>`
          roll.toMessage({type: 4, user: game.user._id, speaker: ChatMessage.getSpeaker(), content: content});
  
        } else {
          const content = `Jet de <b>${element.name}</b>!
          <p></p><b>Stat actuelle: [[${this.familier.data.data.characteristics[element.id].value} + ${this.familier.data.data.characteristics[element.id].modifieur} + ${playerInput}]]</b> <p></p>
          <b>Resultat: [[${roll.total}]]</b><p></p>
          <b>${roll.total<=(this.familier.data.data.characteristics[element.id].value + this.familier.data.data.characteristics[element.id].modifieur + playerInput) ? " <span style='color:green; font-size: 120%;'> <b>REUSSITE !</b></span>" : " <span style='color:red; font-size: 120%;'> <b>ECHEC !</b></span>"}`
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
  