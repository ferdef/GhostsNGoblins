using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class PlantShot : MonoBehaviour
{
    public Vector2 Direction;
    public float Speed;
    private Rigidbody2D mRigidBody;
    private Renderer mRender;

    // Start is called before the first frame update
    void Start()
    {
        
    }

    void Awake()
    {
        this.mRigidBody = this.GetComponent<Rigidbody2D>();
        this.mRender = this.GetComponent<Renderer>();
    }

    // Update is called once per frame
    void Update()
    {
        this.mRigidBody.velocity = this.Direction * this.Speed;

        if (!this.mRender.isVisible)
            this.Destroy();
    }

    private void Destroy()
    {
        GameObject.Destroy(this.gameObject);
    }

    private void OnCollisionEnter2D(Collision2D collision)
    {
        Player player = collision.collider.GetComponent<Player>();
        if (player != null)
        {
            player.HitByPlantShot();
            this.Destroy();
        }
    }
}
