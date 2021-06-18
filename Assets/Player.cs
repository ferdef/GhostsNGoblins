using System.Collections;
using System.Collections.Generic;
using UnityEngine;

[RequireComponent(typeof(BoxCollider2D))]
public class Player : GameElement
{
    public float JumpForceNewtons = 1200f;
    public ePlayerState State = ePlayerState.Idle;
    public bool Grounded = false;
    public GameObject PrefabShot;

    public float PlayerSpeedLadder = 10f;

    public Ladder InLadder;
    public bool ReadyToClimbUp;
    public bool ReadyToClimbDown;

    private BoxCollider2D mGroundCheckCollider;
    private List<PlayerShot> mShots = new List<PlayerShot>();
    private ePlayerState mStateBeforeShooting = ePlayerState.Shoot;
    private float mGravityScaleOriginalValue;
    

    public bool IsShooting
    {
        get { return this.State == ePlayerState.Shoot || this.State == ePlayerState.ShootCrouch; }
    }

    public bool IsClimbing
    {
        get { return this.State == ePlayerState.Climb;  }
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

    public void HitByPlantShot()
    {

    }

    protected override void Awake()
    {
        base.Awake();

        GameManager.Player = this;
        mGroundCheckCollider = this.GetComponent<BoxCollider2D>();
    }

    protected override void Start()
    {
        mGravityScaleOriginalValue = this.mRigidBody.gravityScale;
        base.Start();
    }

    protected override void Update()
    {
        SearchLadders();

        UpdateGroundCheck();

        UpdateInput();

        UpdateAnimator();

        UpdateGraphics();

        UpdatePhysics();

        base.Update();
    }

    private void UpdateGroundCheck()
    {
        Vector2 groundBoxWorldPosition = (Vector2)this.transform.position + this.mGroundCheckCollider.offset;
        Collider2D[] collisions = Physics2D.OverlapBoxAll(groundBoxWorldPosition, this.mGroundCheckCollider.size, 0f);
        Grounded = false;

        foreach (var coll in collisions)
        {
            if (coll.tag == "Player" || coll.tag == "Ladders")
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

        if(IsClimbing && !Input.GetKey(KeyCode.UpArrow) && !Input.GetKey(KeyCode.DownArrow))
        {
            StopClimbing();
        }

        if (Input.GetKeyDown(KeyCode.Z) && Grounded)
            Jump();
        else if (Input.GetKeyDown(KeyCode.X))
        {
            Shoot(Input.GetKey(KeyCode.DownArrow));
        }
        else if (Input.GetKey(KeyCode.DownArrow) && !IsClimbing && !ReadyToClimbDown)
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
        else if (ReadyToClimbUp && Input.GetKey(KeyCode.UpArrow))
        {
            ClimbUp();
        }
        else if (ReadyToClimbDown && Input.GetKey(KeyCode.DownArrow))
        {
            ClimbDown();
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
        if (!Grounded && !IsShooting && !IsClimbing)
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

    private void SearchLadders()
    {
        GameManager.Player.InLadder = null;
        GameManager.Player.ReadyToClimbUp = false;
        GameManager.Player.ReadyToClimbDown = false;

        foreach (Ladder ladder in GameManager.CurrentLevel.Ladders)
        { 
            if (ladder.PrincipalTrigger.bounds.Contains(GameManager.Player.transform.position))
            {
                Debug.Log("Principal");
                GameManager.Player.InLadder = ladder;
                GameManager.Player.ReadyToClimbDown = true;
                GameManager.Player.ReadyToClimbUp = true;
            }
            else if (ladder.UpTrigger.bounds.Contains(GameManager.Player.transform.position))
            {
                Debug.Log("Up");
                GameManager.Player.ReadyToClimbUp = true;
            }
            else if (ladder.DownTrigger.bounds.Contains(GameManager.Player.transform.position))
            {
                Debug.Log("Down");
                GameManager.Player.ReadyToClimbDown = true;
            }
        }
    }

    private void ClimbUp()
    {
        this.State = ePlayerState.Climb;
        mRigidBody.velocity = new Vector2(0, PlayerSpeedLadder);
    }

    private void ClimbDown()
    {
        this.State = ePlayerState.Climb;
        mRigidBody.velocity = new Vector2(0, -PlayerSpeedLadder);
    }

    private void StopClimbing()
    {
        mRigidBody.velocity = Vector2.zero;
    }

    private void UpdatePhysics()
    {
        switch (this.State)
        {
            case ePlayerState.Climb:
                this.mRigidBody.gravityScale = 0;
                break;
            default:
                this.mRigidBody.gravityScale = mGravityScaleOriginalValue;
                break;

        }
    }
}
