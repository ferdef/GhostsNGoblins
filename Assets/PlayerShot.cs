using System.Collections;
using System.Collections.Generic;
using UnityEngine;

[RequireComponent(typeof(Rigidbody2D))]
[RequireComponent(typeof(SpriteRenderer))]
[RequireComponent(typeof(LookDirection))]
public class PlayerShot : MonoBehaviour
{
    public float SpeedX = 40;

    private SpriteRenderer mRender;
    private Rigidbody2D mRigidBody;
    private LookDirection mLookDir;


    private void Awake()
    {
        this.mRender = this.GetComponent<SpriteRenderer>();
        this.mRigidBody = this.GetComponent<Rigidbody2D>();
        this.mLookDir = this.GetComponent<LookDirection>();
    }

    // Start is called before the first frame update
    void Start()
    {
        
    }

    // Update is called once per frame
    void Update()
    {
        this.mRigidBody.velocity = new Vector2((mLookDir.LookLeft ? -1 : 1) * SpeedX, 0);

        if (!this.mRender.isVisible)
        {
            GameManager.Player.DestroyShot(this);
        }
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
