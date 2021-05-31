using System.Collections;
using System.Collections.Generic;
using UnityEngine;

[RequireComponent(typeof(Animator))]
[RequireComponent(typeof(Rigidbody2D))]
[RequireComponent(typeof(BoxCollider2D))]
[RequireComponent(typeof(LookDirection))]
[RequireComponent(typeof(SpriteRenderer))]
public class Player : MonoBehaviour
{
    public float SpeedX = 5f;
    public float JumpForceNewtons = 1200f;
    public ePlayerState State = ePlayerState.Idle;
    public bool Grounded = false;
    public GameObject PrefabShot;

    private Rigidbody2D mRigidBody;
    private SpriteRenderer mSpriteRenderer;
    private Animator mAnimator;
    private BoxCollider2D mGroundCheckCollider;
    private LookDirection mLookDir;
    private List<PlayerShot> mShots = new List<PlayerShot>();

    private void Awake()
    {
        GameManager.Player = this;
        mRigidBody = this.GetComponent<Rigidbody2D>();
        mSpriteRenderer = this.GetComponent<SpriteRenderer>();
        mAnimator = this.GetComponent<Animator>();
        mGroundCheckCollider = this.GetComponent<BoxCollider2D>();
        mLookDir = this.GetComponent<LookDirection>();
    }

    private void UpdateGroundCheck()
    {
        Vector2 groundBoxWorldPosition = (Vector2)this.transform.position + this.mGroundCheckCollider.offset;
        Collider2D[] collisions = Physics2D.OverlapBoxAll(groundBoxWorldPosition, this.mGroundCheckCollider.size, 0f);
        Grounded = false;

        foreach(var coll in collisions)
        {
            if (coll.tag == "Player")
            {
                continue;
            }
            Grounded = true;
            break;
        }
    }


    void Start()
    {
        
    }

    void Update()
    {
        UpdateGroundCheck();

        UpdateInput();

        UpdateAnimator();

        UpdateGraphics();
    }

    private void MoveRight()
    {
        mRigidBody.velocity = new Vector2(SpeedX, this.GetComponent<Rigidbody2D>().velocity.y);
        mLookDir.LookLeft = false;
        this.State = ePlayerState.Run;
    }

    private void MoveLeft()
    {
        mRigidBody.velocity = new Vector2(-SpeedX, this.GetComponent<Rigidbody2D>().velocity.y);
        mLookDir.LookLeft = true;
        this.State = ePlayerState.Run;
    }

    private void Jump()
    {
        mRigidBody.AddForce(new Vector2(0f, JumpForceNewtons));
    }

    private void Stop()
    {
        mRigidBody.velocity = new Vector2(0, this.GetComponent<Rigidbody2D>().velocity.y);
        this.State = ePlayerState.Idle;
    }

    private void UpdateInput()
    {
        
        if (Input.GetKeyDown(KeyCode.Z) && Grounded)
            Jump();

        if (Input.GetKeyDown(KeyCode.X))
        {
            SpawnShot();
        }
        if (Input.GetKey(KeyCode.RightArrow) && Grounded)
        {
            MoveRight();
        }

        else if (Input.GetKey(KeyCode.LeftArrow) && Grounded)
        {
            MoveLeft();
        }
        else if(Grounded)
        {
            Stop();
        }
    }

    private void UpdateAnimator()
    {
        if (!this.Grounded)
        {
            if(Mathf.Abs(this.mRigidBody.velocity.x) > 1)
                mAnimator.Play("JumpRunning");
            else
                mAnimator.Play("JumpIdle");

            return;
        }

        switch (this.State)
        {
            case ePlayerState.Idle:
                mAnimator.Play("Idle");
                break;
            case ePlayerState.Run:
                mAnimator.Play("Run");
                break;
            case ePlayerState.Climb:
                mAnimator.Play("Climb");
                break;
            case ePlayerState.Crouch:
                mAnimator.Play("Crouch");
                break;
            case ePlayerState.Die:
                mAnimator.Play("Death");
                break;
            case ePlayerState.LosingArmour:
                mAnimator.Play("ArmourLost");
                break;
            case ePlayerState.Shoot:
                mAnimator.Play("Shoot");
                break;
            case ePlayerState.ShootCrouch:
                mAnimator.Play("ShootCrouch");
                break;
        }
    }
    private void UpdateGraphics()
    {

    }

    private void SpawnShot()
    {
        GameObject newObj = GameObject.Instantiate(this.PrefabShot, this.transform.position + new Vector3(0, 1.3f, 0), Quaternion.identity);
        LookDirection dir = newObj.GetComponent<LookDirection>();
        dir.LookLeft = this.mLookDir.LookLeft;
        PlayerShot pShot = newObj.GetComponent<PlayerShot>();
        mShots.Add(pShot);
    }
}
