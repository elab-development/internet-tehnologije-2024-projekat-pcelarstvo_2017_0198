<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Role;
use App\Models\Kosnica;
use App\Models\Aktivnost;
use App\Models\Komentar;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {
        // Kreiranje rola
        $adminRole = Role::create([
            'naziv' => 'admin',
            'opis' => 'Administrator sa punim pravima',
        ]);

        $beekeeperRole = Role::create([
            'naziv' => 'pcelar',
            'opis' => 'Pčelar koji upravlja košnicama',
        ]);

        // Kreiranje korisnika
        $adminUser = User::create([
            'name' => 'Admin Pčelar',
            'email' => 'admin@example.com',
            'password' => bcrypt('password'),
            'role_id'=>1
            
        ]);

        $beekeeperUser = User::create([
            'name' => 'Ivan Pčelar',
            'email' => 'ivan@example.com',
            'password' => bcrypt('password'),
            'role_id'=>2
            
        ]);

        //ovo nam ne treba jer smo dodali role_id
        // $adminUser->roles()->attach($adminRole);
        // $beekeeperUser->roles()->attach($beekeeperRole);

        // Kreiranje košnica
        $kosnica1 = Kosnica::create([
            'naziv' => 'Košnica 1',
            'adresa' => 'Pčelarska ulica 12, Beograd',
            'opis' => 'Košnica smeštena na obodu šume',
            'user_id' => $beekeeperUser->id,
            'longitude' => 20.457273,
            'latitude' => 44.817177,
        ]);

        $kosnica2 = Kosnica::create([
            'naziv' => 'Košnica 2',
            'adresa' => 'Pčelarska livada, Novi Sad',
            'opis' => 'Košnica sa cvetnim okruženjem',
            'user_id' => $beekeeperUser->id,
            'longitude' => 19.833549,
            'latitude' => 45.267136,
        ]);

        // Kreiranje aktivnosti
        Aktivnost::create([
            'naziv' => 'Provera matice',
            'datum' => now()->subDays(10),
            'tip' => 'Sezonska',
            'opis' => 'Proverena prisutnost i zdravlje matice',
         
            'kosnica_id' => $kosnica1->id,
            'user_id' => $beekeeperUser->id,
        ]);

        Aktivnost::create([
            'naziv' => 'Dodavanje okvira',
            'datum' => now()->subDays(5),
            'tip' => 'prilagodjena',
            'opis' => 'Dodati novi okviri zbog povećanja meda',
        
            'kosnica_id' => $kosnica2->id,
            'user_id' => $beekeeperUser->id,
        ]);

        // Kreiranje komentara
        Komentar::create([
            'sadrzaj' => 'Košnica izgleda odlično, med je odličnog kvaliteta!',
            'datum' => now()->subDays(3),
            'kosnica_id' => $kosnica1->id,
            'user_id' => $adminUser->id,
        ]);

        Komentar::create([
            'sadrzaj' => 'Preporuka za redovnu proveru u sledećoj nedelji.',
            'datum' => now()->subDays(2),
            'kosnica_id' => $kosnica2->id,
            'user_id' => $adminUser->id,
        ]);
    }
}
