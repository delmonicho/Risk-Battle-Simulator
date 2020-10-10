import { Component, OnInit } from '@angular/core';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { MatIconRegistry } from '@angular/material/icon';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})


export class HomeComponent implements OnInit {
  form: FormGroup;
  attackSuccess: boolean;
  battleOver: boolean;

  constructor( iconRegistry: MatIconRegistry, sanitizer: DomSanitizer ) {
    iconRegistry.addSvgIcon(
      'attacker',
      sanitizer.bypassSecurityTrustResourceUrl('assets/warrior.svg'));
    iconRegistry.addSvgIcon(
      'defender',
      sanitizer.bypassSecurityTrustResourceUrl('assets/superhero.svg'));
  }

  ngOnInit(): void {
    this.form = new FormGroup({
      attackerTroopCount: new FormControl('', [
        Validators.required,
        Validators.pattern('[0-9]+')
      ]),
      defenderTroopCount: new FormControl('', [
        Validators.required,
        Validators.pattern('[0-9]+')
      ]),
      winner: new FormControl('')
    });
  }

  getErrorMessage(): string {
    if (this.form.hasError('required')) {
      return 'You must enter a value';
    }
  }

  rollDice(): void {
    let attackerRoll = null;
    let defenderRoll = null;
    let attackerTroops = this.form.controls.attackerTroopCount.value;
    let defenderTroops = this.form.controls.defenderTroopCount.value;

    if (attackerTroops > 0 && defenderTroops > 0) {
      // handle attacker dice rolls
      if (attackerTroops > 3) {
        attackerRoll = this.rollMany(3, 6);
      } else if (attackerTroops === 3) {
        attackerRoll = this.rollMany(2, 6);
      } else if (attackerTroops <= 2) {
        attackerRoll = this.singleRoll(6);
      }

      // handle defender dice rolls
      if (defenderTroops > 2) {
        defenderRoll = this.rollMany(2, 6);
      } else if (defenderTroops <= 2) {
        defenderRoll = this.singleRoll(6);
      }

      // battle and update troopCount
      if (attackerRoll > defenderRoll) {
        defenderTroops--;
        this.attackSuccess = true;
      } else {
        attackerTroops--;
        this.attackSuccess = false;
      }

      // when one side's troops are reduced to dust, declare a winner/ update troops #
      this.form.patchValue({
        attackerTroopCount: attackerTroops,
        defenderTroopCount: defenderTroops,
        winner: (this.attackSuccess ? 'Attacker Wins' : 'Defender Wins')
      });
      // display icon svg of champion after each battle
      this.battleOver = true;
    }
  }

  // single dice roll function
  singleRoll(sides: number): number {
    return 1 + Math.floor(Math.random() * sides);
  }

  rollMany(count: number, sides: number): number {
    const rolls: number[] = [];

    for (let i = 0; i < count; i++) {
      rolls.push(this.singleRoll(sides));
    }

    const result = rolls.reduce((a: number, b: number) => a + b, 0);

    return result;
  }


}
