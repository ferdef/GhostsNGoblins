using Unity;
using UnityEngine;

class GameManager
{
    public static Player Player;
    public static Level CurrentLevel;

    public static float DistanceToPlayerInX(Transform pTransform)
    {
        return Player.transform.position.x - pTransform.position.x;
    }
}
