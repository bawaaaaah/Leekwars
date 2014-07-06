var enemy = getNearestEnemy();
global currentTP = getTP();
global isInline = false;
global fightInline = false;

/*
** SECTION : Chip
*/

//Decratation
global healChip = CHIP_BANDAGE;
global farFightChip = CHIP_SPARK;
global nearFightChip = CHIP_PEBBLE;
global halfNearChip = CHIP_SHOCK;

//Cooldown Init
global bandageCooldown = 0;
global helmetCooldown = 0;
global stretchingCooldown = 0;
global pebbleCooldown = 0;
global shockCooldown  = 0;

//Cooldown Decrementation
bandageCooldown -= bandageCooldown == 0 ? 0 : 1;
helmetCooldown -= helmetCooldown == 0 ? 0 : 1;
stretchingCooldown -= stretchingCooldown == 0 ? 0 : 1;
pebbleCooldown -= pebbleCooldown == 0 ? 0 : 1;
shockCooldown -= shockCooldown == 0 ? 0 : 1;


/*
** END SECTION
*/

/*
** SECTION : Weapons declaration
*/

global lineWeapon = WEAPON_SHOTGUN;
global cacWeapon = WEAPON_PISTOL;
global farWeapon = WEAPON_DOUBLE_GUN;

/*
** END SECTION
*/

/*
** SECTION : Chip use functions.
*/

/*
** Add these lines at the start of all function of this section arriving lvl 29.
**
** if (canUseChip(ADD CHIP DEFINE HERE, target) == false)
** 		return (false);
*/
function usePebble(target)
{
	if (pebbleCooldown != 0)
		return (false);
	pebbleCooldown = 1;
	return (useChip(CHIP_PEBBLE, target));
}

function useShock(target)
{
	if (shockCooldown != 0)
		return (false);
	shockCooldown = 1;
	return (useChip(CHIP_SHOCK, target));
}

function useBandage(target)
{
	if (bandageCooldown != 0)
		return (false);
	bandageCooldown = 1;
	return (useChip(CHIP_BANDAGE, target));
}

function useHelmet(target)
{
	if (helmetCooldown != 0)
		return (false);
	helmetCooldown = 4;
	return (useChip(CHIP_HELMET, target));
}

function useStretching(target)
{
	if (stretchingCooldown != 0)
		return (false);
	stretchingCooldown = 3;
	return (useChip(CHIP_STRETCHING, target));
}

function useSpark(target)
{
	return (useChip(CHIP_SPARK, target));
}

/*
** END SECTION
*/

/*
** Functions who sets the weapon you want to use
**
** Parameters : None.
** Return : Nothing.
*/

function setCacWeapon()
{
	if (getWeapon() != cacWeapon)
		setWeapon(cacWeapon);
}

function setFarWeapon()
{
	if (getWeapon() != farWeapon)
		setWeapon(farWeapon);
}

function setLineWeapon()
{
	if (getWeapon() != lineWeapon)
		setWeapon(lineWeapon);
}
/*
** Set the initial weapon
*/

if (getWeapon() == -1)
{
	say('HODOR');
	setFarWeapon();
}

/*
** Use Helmet and Agility bonus
*/

if (getCellDistance(getCell(enemy), getCell()) < 15)
{
	if (getTurn() < 7 || (getLife() < 120 && getCellDistance(getCell(enemy), getCell()) > 5))
		useStretching(getLeek());
	useHelmet(getLeek());
}


/*
** Function who indicate if the enemy cat hit you with his weapon, it considers your MP, and enemy's ones.
**
** Parameters :
**			1 : Number of the Leek to inspect.
**			2 : margin if you want to set.
**
** Return :
**			true : Leek (1st param) can hit you.
**			false : Leek (1st param) can't hit you.
*/

function canEnemyHitMe(enemy, marge)
{
	var enemyWeapon = getWeapon(enemy);
	var enemyWeaponScope = getWeaponMaxScope(enemyWeapon);
	var enemyHitScope = enemyWeaponScope + getMP(enemy) - getMP() - marge;
	var sparkScope = 10 + getMP(enemy) - getMP() - marge;
	
	if (getCellDistance(getCell(enemy), getCell()) <= enemyHitScope ||
	getCellDistance(getCell(enemy), getCell()) <= sparkScope)
		return true;
	return false;
}

/*
** Function considers enemie's AI is a dummy one
*/

function dummyEnemyAI(enemy)
{
	var enemyWeapon = getWeapon(enemy);
	var enemyWeaponScope = getWeaponMinScope(enemyWeapon);
	
	if (enemyWeaponScope > 1)
		return (true);
	else
		return (false);
}
/*
** Function who attack at semi-distance++ (7 of range)
**
** Parameters :
**			1 : Number of the Leek to attack.
**			2 : Chip to use.
**			3 : Leek's number. Target of the chip (2nd param).
**
** Return :
**			true : Always return true.
*/

function far (enemy, chip, leek)
{
	var canEnemyHit = canEnemyHitMe(enemy, 0);
	var FIIIGHT = false;
	
	setFarWeapon();
	if (useWeapon(enemy) == USE_SUCCESS ||
		useWeapon(enemy) == USE_SUCCESS)
		FIIIGHT = true;
	useChip(chip, leek);
	if (FIIIGHT == true && canEnemyHit == true)
		moveToward(enemy);
	else
		moveAwayFrom(enemy);
	return (true);
}

/*
** Function who attack at long-range (7+ of range)
**
** Parameters :
**			1 : Number of the Leek to attack.
**
** Return :
**			true : Always Return true.
*/

function farFarAway(enemy)
{
	useBandage(getLeek());
	useSpark(enemy);
	useSpark(enemy);
	moveAwayFrom(enemy);
	return (true);
}

/*
** Function who attack at short-range (5- of range)
**
** Parameters :
**			1 : Number of the Leek to attack.
**			2 : Chip to use.
**			3 : Leek's number. Target of the chip (2nd param).
**
** Return :
**			true : Always return true.
*/


function near (enemy, chip, chipTarget)
{
	if (getCellDistance(getCell(enemy), getCell()) <= 1)
		{
			moveAwayFromCell(getCell(enemy), 1);
			if (getCellDistance(getCell(enemy), getCell()) <= 1)
				setCacWeapon();
			else
				setFarWeapon();
		}
	if (getWeapon() == farWeapon)
	{
		useWeapon(enemy);
		if (getLife() < 150)
		{
			useBandage(getLeek());
			usePebble(enemy);
/*
** Exceptionnal comment. Uncomments these line when lvl 29.
**			if (getTP() >= 3)
**			{
**				useSpark(enemy);
**				useSpark(enemy);
**			}
*/		}
		else
			useWeapon(enemy);
	}
	else
	{
		useWeapon(enemy);
		useWeapon(enemy);
		usePebble(enemy);
	}
	useSpark(enemy);
	useSpark(enemy);
	useBandage(getLeek());
	if (getTurn() > 42 || canEnemyHitMe(enemy,0) == true || dummyEnemyAI(enemy) == true)
		moveToward(enemy);
	else
		moveAwayFrom(enemy);
	return (true);
}

/*
** Function who determines wich function go. It is a kind of main function.
** It considers PM/TP Current life, life of enemy.
**
** Parameters :
**			1 : Number of the Leek to attack.
** Return :
**			true : If an action has been done.
**			false : If no action has been done.
*/

function getAction(enemy)
{
	var chip = null;
	var target = enemy;
	
	if ((getLife() < 200 && canEnemyHitMe(enemy, 0) == false) ||
		(getLife() < 120))
	{
		chip = healChip;
		bandageCooldown = 1;
		target = getLeek();
	}
	if (getCellDistance(getCell(enemy), getCell()) <= 5)
	{
		chip = chip == null ? nearFightChip : chip;
		return (near(enemy, chip, target));
	}
	else if (getCellDistance(getCell(enemy), getCell()) == 6)
	{
		chip = chip == null ? halfNearChip : chip;
		return (near(enemy, chip, target));
	}
	else if (getCellDistance(getCell(enemy), getCell()) <= 7)
	{
		chip = chip == null ? farFightChip : chip;
		return (far(enemy, chip, target));
	}
	else if (getCellDistance(getCell(enemy), getCell()) <= 10)
		return (farFarAway(enemy));
	return (false);
}

/*
**
*/

function checkIfIsInline(enemy)
{
	var curIsInline = true;
	
	if (isOnSameLine(getCell(), getCell(enemy)) == false ||
		getDistance(getCell(), getCell(enemy)))
		curIsInline = false;
	return (curIsInline);
}

/*
**
*/

function enemyIsInline(enemy)
{
	setLineWeapon();
	if (useWeapon(enemy) == USE_INVALID_POSITION)
		{
			useBandage(getLeek());
			setFarWeapon();
			moveAwayFrom(enemy);
		}
	else
		{
			useSpark(enemy);
			moveToward(enemy);
		}
	return (true);
}

/*
**
*/

function checkIfHeIsGone(enemy)
{
	var mp = getMP();
	
	if (mp == 1)
	{
		setFarWeapon();
		return (false);
	}
	return (true);
}

/*
** function main
*/
function main(enemy)
{
	while (getMP() > 0)
	{
		if (checkIfIsInline(enemy) == true)
		{
			enemyIsInline(enemy);
			fightInline = true;
			return (true);
		}
		else
			fightInline = checkIfHeIsGone(enemy);
		if (fightInline == false && getAction(enemy) == true)
		{
			if (canEnemyHitMe(enemy, -2) == true)
				moveAwayFrom(enemy);
			return (true);
		}
		moveTowardCell(getCell(enemy), 1);
	}
}
/*
** main loop
**
** As AI is a little fearfull, the 50 turns can be reached easily,
** in this case, go rush the ennemy.
*/

if (getTurn() > 42)
	near(enemy, CHIP_PEBBLE, enemy);
else
	main(enemy);
useStretching(getLeek());
useBandage(getLeek());