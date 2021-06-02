using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class Crow : GameElement
{
    public float ActivationThreshold = 30;
    private bool IsFlying = false;

    public override void HitByPlayerShot()
    {
        this.Destroy();
    }

    protected override void Awake()
    {
        base.Awake();
    }

    protected override void Start()
    {
        base.Start();

        this.DestroyWhenNotVisible = false;
    }

    // Update is called once per frame
    protected override void Update()
    {
        
        if (IsFlying)
        {
            mAnimator.Play("CrowFly");
            this.mRigidBody.velocity = new Vector2((mLookDir.LookLeft ? -1 : 1) * SpeedX, Mathf.Sin(Time.time * 2f) * 1.6f );
            this.DestroyWhenNotVisible = true;
        }
        else
        {
            mAnimator.Play("CrowStand");
            mRigidBody.velocity = Vector2.zero;
            mLookDir.LookLeft = GameManager.DistanceToPlayerInX(this.transform) < 0;
            this.DestroyWhenNotVisible = false;

            IsFlying = Mathf.Abs(GameManager.DistanceToPlayerInX(this.transform)) < ActivationThreshold;
        }

        base.Update();
    }
}
