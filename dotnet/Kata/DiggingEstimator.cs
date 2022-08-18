namespace Kata;

public class DiggingEstimator
{

    public TeamComposition Tunnel(int length, int days, string rockType)
    {
        List<double> digPerRotation = Get(rockType);
        var maxDigPerRotation = digPerRotation[digPerRotation.Count - 1];
        var maxDigPerDay = 2 * maxDigPerRotation;

        if (length < 0 || days < 0)
        {
            throw new InvalidFormatException();
        }

        if (Math.Floor((double)length / days) > maxDigPerDay)
        {
            throw new TunnelTooLongForDelayException();
        }

        var c = new TeamComposition();

        for (var i = 0; i < digPerRotation.Count - 1; ++i)
        {
            if (digPerRotation[i] < Math.Floor((double)length / days))
            {
                c.DayTeam.Miners++;
            }
        }

        if (Math.Floor((double)length / days) > maxDigPerRotation)
        {
            for (var i = 0; i < digPerRotation.Count - 1; ++i)
            {
                if (digPerRotation[i] + maxDigPerRotation < Math.Floor((double)length / days))
                {
                    c.NightTeam.Miners++;
                }
            }   
        }

        var dt = c.DayTeam;
        var nt = c.NightTeam;
        
        if (dt.Miners > 0) {
            ++dt.Healers;
            ++dt.Smithies;
            ++dt.Smithies;
        }

        if (nt.Miners > 0) {
            ++nt.Healers;
            nt.Smithies += 2;
        }

        if (nt.Miners > 0) {
            nt.Lighters = nt.Miners + 1;
        }

        if (dt.Miners > 0) {
            dt.InnKeepers = (int) (Math.Ceiling((dt.Miners + dt.Healers + dt.Smithies) / 4.0) * 4);
            dt.Washers = (int) Math.Ceiling((double) (dt.Miners + dt.Healers + dt.Smithies + dt.InnKeepers) / 10.0);
        }

        if (nt.Miners > 0) {
            nt.InnKeepers = (int) Math.Ceiling((double) (nt.Miners + nt.Healers + nt.Smithies + nt.Lighters) / 4) * 4;
        }

        while (true) {
            var oldWashers = nt.Washers;
            var oldGuard = nt.Guards;
            var oldChiefGuard = nt.GuardManagers;

            nt.Washers = (int) Math.Ceiling((double) (nt.Miners + nt.Healers + nt.Smithies + nt.InnKeepers + nt.Lighters + nt.Guards + nt.GuardManagers) / 10);
            nt.Guards = (int) Math.Ceiling((double) (nt.Healers + nt.Miners + nt.Smithies + nt.Lighters + nt.Washers) / 3);
            nt.GuardManagers = (int) Math.Ceiling((double) (nt.Guards) / 3);

            if (oldWashers == nt.Washers && oldGuard == nt.Guards && oldChiefGuard == nt.GuardManagers) {
                break;
            }
        }

        c.Total = dt.Miners + dt.Washers + dt.Healers + dt.Smithies + dt.InnKeepers +
                  nt.Miners + nt.Washers + nt.Healers + nt.Smithies + nt.InnKeepers + nt.Guards + nt.GuardManagers + nt.Lighters;
        return c;
    }

    private List<double> Get(string rockType)
    {
        // For example, for granite it returns [0, 3, 5.5, 7]
        // if you put 0 dwarf, you dig 0m/d/team
        // if you put 1 dwarf, you dig 3m/d/team
        // 2 dwarves = 5.5m/d/team
        // so a day team on 2 miners and a night team of 1 miner dig 8.5m/d
        string url = "dtp://research.vin.co/digging-rate/" + rockType;
        Console.WriteLine("Tried to fetch" + url);
        throw new NotImplementedException("Does not work in test mode");
    }
}

public class TunnelTooLongForDelayException : Exception
{
}

public class InvalidFormatException : Exception
{
}

public class TeamComposition
{
    public Team DayTeam { get; set; } = new Team();
    public Team NightTeam { get; set; }= new Team();
    public int Total { get; set; }
}

public class Team
{
    public int Miners { get; set; }
    public int Healers { get; set; }
    public int Smithies { get; set; }
    public int Lighters { get; set; }
    public int InnKeepers { get; set; }
    public int Guards { get; set; }
    public int GuardManagers { get; set; }
    public int Washers { get; set; }
}