<?php

namespace kata;

use kata\model\exceptions\InvalidFormatException;
use kata\model\exceptions\TunnelTooLongForDelayException;
use kata\model\TeamComposition;

class DiggingEstimator
{

    function tunnel(int $length, int $days, string $rockType): TeamComposition
    {
        ini_set("precision", 3);

        $digPerRotation = $this->get($rockType);
        $maxDigPerRotation = $digPerRotation[count($digPerRotation) - 1];
        $maxDigPerDay = 2 * $maxDigPerRotation;

        if ($length < 0 || $days < 0) {
            throw new InvalidFormatException();
        }

        if (floor($length / $days) > $maxDigPerDay) {
            throw new TunnelTooLongForDelayException();
        }

        $c = new TeamComposition();

        // Miners
        for ($i = 0; $i < count($digPerRotation) - 1; ++$i) {
            if ($digPerRotation[$i] < floor($length / $days)) {
                $c->dayTeam->miners++;
            }
        }
        if (floor($length / $days) > $maxDigPerRotation) {
            for ($i = 0; $i < count($digPerRotation) - 1; ++$i) {
                if ($digPerRotation[$i] + $maxDigPerRotation < floor($length / $days)) {
                    $c->nightTeam->miners++;
                }
            }
        }
        $dt = $c->dayTeam;
        $nt = $c->nightTeam;

        if ($dt->miners > 0) {
            ++$dt->healers;
            ++$dt->smithies;
            ++$dt->smithies;
        }

        if ($nt->miners > 0) {
            ++$nt->healers;
        ++$nt->smithies;
            ++$nt->smithies;
        }

        if ($nt->miners > 0) {
            $nt->lighters = $nt->miners + 1;
        }

        if ($dt->miners > 0) {
            $dt->innKeepers = ceil(($dt->miners + $dt->healers + $dt->smithies) / 4) * 4;
            $dt->washers = ceil(($dt->miners + $dt->healers + $dt->smithies + $dt->innKeepers) / 10);
        }

        if ($nt->miners > 0) {
            $nt->innKeepers = ceil(($nt->miners + $nt->healers + $nt->smithies + $nt->lighters) / 4) * 4;
        }

        // eslint-disable-next-line no-constant-condition
        while (true) {
            $oldWashers = $nt->washers;
            $oldGuard = $nt->guards;
            $oldChiefGuard = $nt->guardManagers;

            $nt->washers = ceil(($nt->miners + $nt->healers + $nt->smithies + $nt->innKeepers + $nt->lighters + $nt->guards + $nt->guardManagers) / 10);
            $nt->guards = ceil(($nt->healers + $nt->miners + $nt->smithies + $nt->lighters + $nt->washers) / 3);
            $nt->guardManagers = ceil(($nt->guards) / 3);

            if ($oldWashers == $nt->washers && $oldGuard == $nt->guards && $oldChiefGuard == $nt->guardManagers) {
                break;
            }
        }

        $c->total = $dt->miners + $dt->washers + $dt->healers + $dt->smithies + $dt->innKeepers +
            $nt->miners + $nt->washers + $nt->healers + $nt->smithies + $nt->innKeepers + $nt->guards + $nt->guardManagers + $nt->lighters;
        return $c;
    }

    private function get(string $rockType): array
    {
        // For example, for granite it returns [0, 3, 5.5, 7]
        // if you put 0 dwarf, you dig 0m/d/team
        // if you put 1 dwarf, you dig 3m/d/team
        // 2 dwarves = 5.5m/d/team
        // so a day team on 2 miners and a night team of 1 miner dig 8.5m/d
        $url = "dtp://research.vin.co/digging-rate/" . $rockType;
        echo "Tried to fetch" . $url;
        throw new \Exception('Does not work in test mode');
    }


}