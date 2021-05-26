using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class zombie : MonoBehaviour
{
    public eZombieState State = eZombieState.Appearing;
    public float SpeedX = 3;
    private Animator mAnimator;
    private Rigidbody2D mRigidBody;
    private BoxCollider2D mBoxCollider;
    private LookDirection mLookDir;

    private void Awake()
    {
        this.mAnimator = this.GetComponent<Animator>();
        this.mBoxCollider = this.GetComponent<BoxCollider2D>();
        this.mRigidBody = this.GetComponent<Rigidbody2D>();
        this.mLookDir = this.GetComponent<LookDirection>();
    }

    private void Start()
    {
        mBoxCollider.enabled = false;
    }

    // Update is called once per frame
    void Update()
    {
        switch (this.State)
        {
            case eZombieState.Appearing:
                mAnimator.Play("ZombieStart");
                mRigidBody.velocity = Vector2.zero;
                break;
            case eZombieState.Walking:
                mAnimator.Play("ZombieWalk");
                this.mRigidBody.velocity = new Vector2((mLookDir.LookLeft ?  -1 : 1) * SpeedX, this.mRigidBody.velocity.y);
                break;
            case eZombieState.Disappearing:
                mAnimator.Play("ZombieEnd");
                mRigidBody.velocity = Vector2.zero;
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
}
