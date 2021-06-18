using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class PlantShot : MonoBehaviour
{
    public Vector2 Direction;
    public float Speed;
    private Rigidbody2D mRigidBody;

    // Start is called before the first frame update
    void Start()
    {
        
    }

    void Awake()
    {
        this.mRigidBody = this.GetComponent<Rigidbody2D>();    
    }

    // Update is called once per frame
    void Update()
    {
        this.mRigidBody.velocity = this.Direction * this.Speed;
    }
}
