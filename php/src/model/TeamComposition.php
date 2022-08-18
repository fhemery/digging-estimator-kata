<?php

namespace kata\model;

class TeamComposition
{
    public Team $dayTeam;
    public Team $nightTeam;
    public int $total;

    public function __construct()
    {
        $this->dayTeam = new Team();
        $this->nightTeam = new Team();
    }
}