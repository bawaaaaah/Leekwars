//--------------------------------
//------- Code de base -----------
//--------------------------------

// On prend le pistolet
if (getWeapon() == -1)
	setWeapon(WEAPON_PISTOL); // Attention : coûte 1 PT

// On récupère l'ennemi le plus proche
var enemy = getNearestEnemy();

// On avance vers l'ennemi
moveToward(enemy);

// On essaye de lui tirer dessus
var tp = getTP();
while(getWeaponCost(getWeapon()) <= tp)
{
	useWeapon(enemy);
	tp -= getWeaponCost(getWeapon());
}
