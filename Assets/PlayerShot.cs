using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class PlayerShot : MonoBehaviour
{
    public float SpeedX = 40;

    private Rigidbody2D mRigidBody;
    private LookDirection mLookDir;


    private void Awake()
    {
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
    }

    private void OnCollisionEnter2D(Collision2D collision)
    {
        Zombie zombie = collision.collider.GetComponent<Zombie>();
        if (zombie != null)
        {
            zombie.HitByPlayerShot();
        }
    }
}
