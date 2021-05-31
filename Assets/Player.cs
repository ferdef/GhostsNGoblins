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
    private ePlayerState mStateBeforeShooting = ePlayerState.Shoot;

    public bool IsShooting
    {
        get { return this.State == ePlayerState.Shoot || this.State == ePlayerState.ShootCrouch; }
    }

    void Awake()
    {
        GameManager.Player = this;
        mRigidBody = this.GetComponent<Rigidbody2D>();
        mSpriteRenderer = this.GetComponent<SpriteRenderer>();
        mAnimator = this.GetComponent<Animator>();
        mGroundCheckCollider = this.GetComponent<BoxCollider2D>();
        mLookDir = this.GetComponent<LookDirection>();
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

    public void DestroyShot(PlayerShot pShot)
    {
        GameObject.Destroy(pShot.gameObject);

        if (mShots.Contains(pShot))
        {
            mShots.Remove(pShot);
        }
    }

    public void ShootAnimationFinished()
    {
        this.State = this.mStateBeforeShooting;
    }

    private void UpdateGroundCheck()
    {
        Vector2 groundBoxWorldPosition = (Vector2)this.transform.position + this.mGroundCheckCollider.offset;
        Collider2D[] collisions = Physics2D.OverlapBoxAll(groundBoxWorldPosition, this.mGroundCheckCollider.size, 0f);
        Grounded = false;

        foreach (var coll in collisions)
        {
            if (coll.tag == "Player")
            {
                continue;
            }
            Grounded = true;
            break;
        }
    }

    private void UpdateInput()
    {
        // WARNING: Order of these actions is 100% relevant. Shoot and then jump, should preceed to everything else

        if (IsShooting)
        {
            return;
        }

        if (Input.GetKeyDown(KeyCode.Z) && Grounded)
            Jump();
        else if (Input.GetKeyDown(KeyCode.X))
        {
            Shoot(Input.GetKey(KeyCode.DownArrow));
        }
        else if (Input.GetKey(KeyCode.DownArrow))
        {
            Crouch();
        }
        else if (Input.GetKey(KeyCode.RightArrow) && Grounded)
        {
            MoveRight();
        }
        else if (Input.GetKey(KeyCode.LeftArrow) && Grounded)
        {
            MoveLeft();
        }
        else if (Grounded)
        {
            Stop();
        }
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

    private void Crouch()
    {
        this.State = ePlayerState.Crouch;
    }

    private void Shoot(bool pCrouch)
    {
        if (mShots.Count < 3)
        {
            mStateBeforeShooting = this.State;
            SpawnShot();
            if (pCrouch)
                this.State = ePlayerState.ShootCrouch;
            else
                this.State = ePlayerState.Shoot;
        }        
    }


    private void Stop()
    {
        mRigidBody.velocity = new Vector2(0, this.GetComponent<Rigidbody2D>().velocity.y);
        this.State = ePlayerState.Idle;
    }

    private void UpdateAnimator()
    {
        // Make the jump preceed any other animation, except the Shoot animation
        // The second condition (!IsShooting) allows this, to play the shoot animation if we are in the middle of a Jump
        if (!Grounded && !IsShooting)
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
        Vector3 offset = (this.State == ePlayerState.Crouch) ? new Vector3(0, 0.75f, 0) : new Vector3(0, 1.6f, 0);
        GameObject newObj = GameObject.Instantiate(this.PrefabShot, this.transform.position + offset, Quaternion.identity);
        LookDirection dir = newObj.GetComponent<LookDirection>();
        dir.LookLeft = this.mLookDir.LookLeft;
        PlayerShot pShot = newObj.GetComponent<PlayerShot>();
        mShots.Add(pShot);
    }
}
