import model.TeamComposition;
import model.exceptions.InvalidFormatException;
import model.exceptions.TunnelTooLongForDelayException;

import java.util.List;

public class DiggingEstimator {
    public TeamComposition tunnel(int length, int days, String rockType) {
        List<Double> digPerRotation = this.get(rockType);
        double maxDigPerRotation = digPerRotation.get(digPerRotation.size() - 1);
        double maxDigPerDay = 2 * maxDigPerRotation;

        if (length < 0 || days < 0) {
            throw new InvalidFormatException();
        }
        if (Math.floor((float) length / days) > maxDigPerDay) {
            throw new TunnelTooLongForDelayException();
        }

        var c = new TeamComposition();

        //Miners
        for (int i = 0; i < digPerRotation.size() - 1; ++i) {
            if (digPerRotation.get(i) < Math.floor((float) length / days)) {
                c.dayTeam.miners++;
            }
        }

        if (Math.floor((float) length / days) > maxDigPerRotation) {
            for (int i = 0; i < digPerRotation.size() - 1; ++i) {
                if (digPerRotation.get(i) + maxDigPerRotation < Math.floor((float) length / days)) {
                    c.nightTeam.miners++;
                }
            }
        }

        var dt = c.dayTeam;
        var nt = c.nightTeam;

        if (dt.miners > 0) {
            ++dt.healers;
            ++dt.smithies;
            ++dt.smithies;
        }

        if (nt.miners > 0) {
            ++nt.healers;
            nt.smithies += 2;
        }

        if (nt.miners > 0) {
            nt.lighters = nt.miners + 1;
        }

        if (dt.miners > 0) {
            dt.innKeepers = (int) (Math.ceil((double) (dt.miners + dt.healers + dt.smithies) / 4.0) * 4);
            dt.washers = (int) Math.ceil((double) (dt.miners + dt.healers + dt.smithies + dt.innKeepers) / 10);
        }

        if (nt.miners > 0) {
            nt.innKeepers = (int) Math.ceil((double) (nt.miners + nt.healers + nt.smithies + nt.lighters) / 4) * 4;
        }

        while (true) {
            var oldWashers = nt.washers;
            var oldGuard = nt.guards;
            var oldChiefGuard = nt.guardManagers;

            nt.washers = (int) Math.ceil((double) (nt.miners + nt.healers + nt.smithies + nt.innKeepers + nt.lighters + nt.guards + nt.guardManagers) / 10);
            nt.guards = (int) Math.ceil((double) (nt.healers + nt.miners + nt.smithies + nt.lighters + nt.washers) / 3);
            nt.guardManagers = (int) Math.ceil((double) (nt.guards) / 3);

            if (oldWashers == nt.washers && oldGuard == nt.guards && oldChiefGuard == nt.guardManagers) {
                break;
            }
        }

        c.total = dt.miners + dt.washers + dt.healers + dt.smithies + dt.innKeepers +
                nt.miners + nt.washers + nt.healers + nt.smithies + nt.innKeepers + nt.guards + nt.guardManagers + nt.lighters;
        return c;
    }

    private List<Double> get(String rockType) {
        // For example, for granite it returns [0, 3, 5.5, 7]
        // if you put 0 dwarf, you dig 0m/d/team
        // if you put 1 dwarf, you dig 3m/d/team
        // 2 dwarves = 5.5m/d/team
        // so a day team on 2 miners and a night team of 1 miner dig 8.5m/d
        String url = "dtp://research.vin.co/digging-rate/" + rockType;
        System.out.println("Tried to fetch" + url);
        throw new UnsupportedOperationException("Does not work in test mode");
    }
}
