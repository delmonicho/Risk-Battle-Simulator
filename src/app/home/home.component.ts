import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})


export class HomeComponent implements OnInit {
  // form: FormGroup;
  // submitted = false;

  attackerTroopCount = new FormControl([
    '',
    Validators.required,
    Validators.pattern('[0-9]+')
  ]);
  defenderTroopCount = new FormControl([
    '',
    Validators.required,
    Validators.pattern('[0-9]+')
  ]);
  winner = new FormControl('');

  constructor( ) { }

  ngOnInit(): void {
    // this.form = this.fb.group({
    //   attackerTroopCount: [
    //     '',
    //     Validators.required,
    //     Validators.pattern('[0-9]+')
    //   ],
    //   defenderTroopCount: [
    //     '',
    //     Validators.required,
    //     Validators.pattern('[0-9]+')
    //   ],
    //   winner: new FormControl('')
    // });
  }

  // get formControl() {
  //   return this.form.controls;
  // }

  // onSubmit() {
  //   this.submitted = true;
  //   if (this.form.valid) {
  //     alert('Form Submitted succesfully!!!\n Check the values in browser console.');
  //     console.table(this.form.value);
  //   }
  // }

  rollDice(): void {
    let attackerRoll = null;
    let defenderRoll = null;
    let attackerTroops = this.attackerTroopCount.value;
    let defenderTroops = this.defenderTroopCount.value;

    while (attackerTroops > 0 && defenderTroops > 0) {
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
      console.log('Attacker roll total: ' + attackerRoll + '\tDefender roll total: ' + defenderRoll);

      // battle and update troopCount
      if (attackerRoll > defenderRoll) {
        defenderTroops--;
      } else {
        attackerTroops--;
      }
      console.log('Attacker troops: ' + attackerTroops + '\tDefender troops: ' + defenderTroops);
    }
    // when one side's troops are reduced to dust, declare a winner
    if (defenderTroops === 0) {
      this.winner.setValue('Attacker Wins');
    } else {
      this.winner.setValue('Defender Wins');
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
