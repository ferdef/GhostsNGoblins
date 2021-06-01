using System.Collections;
using System.Collections.Generic;
using UnityEngine;

[RequireComponent(typeof(BoxCollider2D))]
public class Zombie : GameElement
{
    public eZombieState State = eZombieState.Appearing;
    public float MaxTimeLiving = 15f;
    
    private BoxCollider2D mBoxCollider;
    private float mTimeLiving;
    private float mGravityScaleOriginalValue;


    public override void MyAwake()
    {
        base.MyAwake();
        this.mBoxCollider = this.GetComponent<BoxCollider2D>();
    }

    public override void MyStart()
    {
        base.MyStart();

        this.mGravityScaleOriginalValue = this.mRigidBody.gravityScale;
        mBoxCollider.enabled = false;
        mTimeLiving = 0;
    }

    public override void MyUpdate()
    {
        mTimeLiving += Time.deltaTime;

        if (mTimeLiving > MaxTimeLiving)
        {
            this.State = eZombieState.Disappearing;
        }

        switch (this.State)
        {
            case eZombieState.Appearing:
                mAnimator.Play("ZombieStart");
                mRigidBody.velocity = Vector2.zero;
                this.mRigidBody.gravityScale = 0;
                break;
            case eZombieState.Walking:
                mAnimator.Play("ZombieWalk");
                this.mRigidBody.velocity = new Vector2((mLookDir.LookLeft ?  -1 : 1) * SpeedX, this.mRigidBody.velocity.y);
                this.mRigidBody.gravityScale = mGravityScaleOriginalValue;
                break;
            case eZombieState.Disappearing:
                mAnimator.Play("ZombieEnd");
                mRigidBody.velocity = Vector2.zero;
                this.mRigidBody.gravityScale = 0;
                break;
        }

        base.MyUpdate();
    }

    public virtual void Destroy()
    {
        GameManager.CurrentLevel.DestroyOnNextFrame(this.gameObject);
        base.Destroy();
    }

    /// <summary>
    /// 
    /// </summary>
    /// <param name="collision"></param>
    private void OnCollisionEnter2D(Collision2D collision)
    {
        Grave grv = collision.collider.GetComponent<Grave>();
        if (grv!=null)
        {
            mLookDir.LookLeft = !mLookDir.LookLeft;
        }
    }

    /// <summary>
    /// 
    /// </summary>
    public void StartAnimationFinished()
    {
        this.State = eZombieState.Walking;
        mBoxCollider.enabled = true;
    }

    public void HitByPlayerShot()
    {
        this.Destroy();
    }
}
