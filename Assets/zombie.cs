using System.Collections;
using System.Collections.Generic;
using UnityEngine;

[RequireComponent(typeof(Animator))]
[RequireComponent(typeof(Rigidbody2D))]
[RequireComponent(typeof(BoxCollider2D))]
[RequireComponent(typeof(LookDirection))]
public class Zombie : MonoBehaviour
{
    public eZombieState State = eZombieState.Appearing;
    public float SpeedX = 3;
    public float MaxTimeLiving = 15f;
    
    private Animator mAnimator;
    private Rigidbody2D mRigidBody;
    private BoxCollider2D mBoxCollider;
    private LookDirection mLookDir;
    private float mTimeLiving;
    private float mGravityScaleOriginalValue;


    private void Awake()
    {
        this.mAnimator = this.GetComponent<Animator>();
        this.mBoxCollider = this.GetComponent<BoxCollider2D>();
        this.mRigidBody = this.GetComponent<Rigidbody2D>();
        this.mLookDir = this.GetComponent<LookDirection>();
    }

    private void Start()
    {
        this.mGravityScaleOriginalValue = this.mRigidBody.gravityScale;
        mBoxCollider.enabled = false;
        mTimeLiving = 0;
    }

    // Update is called once per frame
    void Update()
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
        GameManager.CurrentLevel.DestroyOnNextFrame(this.gameObject);
    }
}
