using System.Collections;
using System.Collections.Generic;
using UnityEngine;


public class PlayerShot : GameElement
{
    // Update is called once per frame
    public override void MyUpdate()
    {
        this.mRigidBody.velocity = new Vector2((mLookDir.LookLeft ? -1 : 1) * SpeedX, 0);

        base.MyUpdate();
    }

    public override void Destroy()
    {
        GameManager.Player.DestroyShot(this);
        base.Destroy();
    }

    private void OnCollisionEnter2D(Collision2D collision)
    {
        Zombie zombie = collision.collider.GetComponent<Zombie>();
        if (zombie != null)
        {
            zombie.HitByPlayerShot();
            GameManager.Player.DestroyShot(this);
        }

        Grave grave = collision.collider.GetComponent<Grave >();
        if (grave != null)
        {
            grave.HitByPlayerShot();
            GameManager.Player.DestroyShot(this);
        }
    }
}
