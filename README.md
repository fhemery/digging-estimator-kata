# Combien faut-il de nains...

... pour creuser un tunnel de 28 mètres dans du granite en 2 jours ?

Les experts de PenOfChaos se sont posés la question à l'époque et les détails sont ici : https://www.youtube.com/watch?v=5rOU7Uu0sBQ

Les études du Professeur Pockovsky ont été approfondies depuis, et il nous fallait un programme capable de calculer le nombre de nains nécessaire. Chez Dwarf Mines Inc, nous l'avons fait.

Le problème, c'est que nous avons confié le code à Thierry, notre développeur très senior. Tellement sénior qu'il est parti à la retraite le mois dernier, et tout ce qu'on
a trouvé, c'est son code. Un cabinet d'expertise nous a révélé que le code de Thierry n'était pas tout à fait ce qu'on appelle une merveille. En même temps, Thierry, il vient d'un langage de programmation un peu vieux, il faut l'excuser.

Oh, et les-dits experts ont trouvé au moins trois bugs aux limites du système, parait-il. Mais il fallait payer vraiment très cher pour qu'ils les listent, et aucun client ne s'est jamais plaint, alors...

Nous devons conserver l'avantage, nous sommes la meilleure agence d'estimation de creusage de tunnel du Comté. C'est pour cela que vous êtes ici.

## Votre mission

Implémenter une nouvelle fonctionnalité, tout en rendant le code prêt à absorber la pléthore d'autres nouvelles fonctions à venir.

Et si au passage vous arriviez à mettre la main sur ces bugs, on serait quand même drôlement contents.

## L'application actuelle

Il est difficile de savoir ce que fait le code en détail, mais nous nous sommes basés sur les derniers rapports du professeur Pockovsky pour les règles :

- **Un nain peut creuser une certaine distance par jour** dans la roche (e.g. : le granite -> 3m)
- On peut mettre jusqu'à trois nains pour miner dans le tunnel (`miners`), mais plus on en met, moins ils produisent. Au delà de trois, ils passent tellement de temps à se taper dessus qu'ils n'avancent plus. Par exemple, pour le granite : 1 nain = 3m/j, 2 nains = 5.5m/j, 3 nains = 7m/j
- On peut mettre une équipe de jour et une équipe de nuit pour aller plus vite
- En revanche, **les nains ont besoin de support pour creuser** :
  - Ils ont besoin de **forgerons** (`smithies`) pour s'assurer que leurs pioches restent efficaces. Il en faut **2 par équipe**.
  - Ils ont besoin de **soigneurs** (`healers`), tant pour soigner les blessures involontaires qu'après les bastons. Il en faut **1 par équipe**.
  - Malgré leur infravision, **la nuit**, ils ont besoin d'**éclaireurs** (`lighters`) pour continuer à miner efficacement. Il en faut **1 par mineur + 1 pour le reste du camp**
  - Tout ce petit monde a besoin de bière. Les **taverniers** (`innkeepers`) sont indispensables.
    Le problème, c'est que comme ils sont toujours près des tonneaux de bière, ils finissent souvent ivres avant la fin du service.
    Par équipe, il en faut donc **4 par tranche de 4 nains** appartenant aux groupes ci-dessus : (`miners`, `smithies`, `healers`, `lighters`)
  - **La nuit**, les nains ont encore moins envie de travailler, et encore plus envie de boire.
    Il faut donc surveiller les tonneaux de bière. On a besoin de **gardes** (`guards`).
    Il en faut **1 par tranche de 3 nains qui ne soit pas tavernier** (`innkeeper`)
  - Il faut quelqu'un pour garder les gardes, sinon ils finissent dans le même état que les taverniers.
    Il faut **1 chef des gardes (`guardManager`) par tranche de 3 gardes**
  - Les nains ne supportent pas de boire leur bière dans des choppines sales.
    Il faut donc des gens à la **vaisselle** (`washers`). Pour chaque équipe, il en faut **1 par tranche de 10 nains sur le chantier (sauf ceux qui font la vaisselle)**
- **Quand un nain est assigné à un chantier, il y reste pour toute la durée** (après tout, il y a de la bière à proximité).
  Inutile donc d'espérer ajuster une équipe sur la fin.
- C'est la Vigilante Institution Naine (V.I.N) qui établit (avec brio !) les distances de pioche en fonction de la roche. **Nous avons donc un webservice pour récupérer ces données**

_**Objectif**_ : étant donnés une longueur à creuser,
une durée pour creuser (en jours, entiers),
et un type de roche,
établir la composition des équipes de jour et de nuit sur le chantier,
et ainsi le total de nains sur le chantier

## Nouvelle fonctionnalité

Des rapports ont indiqué qu'en creusant, il n'est pas rare de tomber sur des gobelins (si si, c'est dans les premiers commentaires de la vidéo).

La V.I.N. a récemment mis à disposition un nouveau service pour savoir s'il y a des gobelins dans la zone. L'URL : `dtp://research.vin.co/are-there-goblins/{location}` (DTP = Dwarfish Transfert Protocol)

Il faut donc que notre estimateur prenne en entrée la région dans laquelle on veut creuser (sous forme de chaine de caractères).

Le service répond `true` ou `false`. S'il y a des gobelins, alors :

- il faut **ajouter au chantier 2 protecteurs (`protectors`) à chaque équipe** (jour et nuit).
- de nuit, **ces protecteurs ont chacun besoin d'un éclaireur** (`lighter`) pour les éclairer. On se bat nettement moins bien dans le noir
- évidemment, les protecteurs consomment de la bière, donc **ils impactent le nombre de taverniers** (`innkeepers`) nécessaires
- ils génèrent donc de la vaisselle, donc **ils augmentent potentiellement le nombre de laveurs de vaisselle** (`washers`)
- en revanche **pas besoin d'ajouter des gardes pour eux**. Ils sont armés, donc ça ne ferait qu'augmenter le nombre de soigneurs nécessaires
