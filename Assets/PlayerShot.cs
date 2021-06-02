using System.Collections;
using System.Collections.Generic;
using UnityEngine;


public class PlayerShot : GameElement
{
    public override void Destroy()
    {
        GameManager.Player.DestroyShot(this);

        // Intentionally avoiding to call the base class, as we override this behavior
        // base.Destroy();
    }

    // Update is called once per frame
    protected override void Update()
    {
        this.mRigidBody.velocity = new Vector2((mLookDir.LookLeft ? -1 : 1) * SpeedX, 0);

        base.Update();
    }

    private void OnCollisionEnter2D(Collision2D collision)
    {
        GameElement element = collision.collider.GetComponent<GameElement>();
        if (element != null)
        {
            element.HitByPlayerShot();
            this.Destroy();
        }
    }
}
