using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using UnityEngine;

[RequireComponent(typeof(Animator))]
[RequireComponent(typeof(Rigidbody2D))]
[RequireComponent(typeof(LookDirection))]
[RequireComponent(typeof(SpriteRenderer))]
public class GameElement : MonoBehaviour
{
    protected SpriteRenderer mRender;
    protected Rigidbody2D mRigidBody;
    protected LookDirection mLookDir;
    protected Animator mAnimator;

    public float SpeedX;
    public bool DestroyWhenNotVisible = false;

    public virtual void MyAwake()
    {
        this.mRender = this.GetComponent<SpriteRenderer>();
        this.mRigidBody = this.GetComponent<Rigidbody2D>();
        this.mLookDir = this.GetComponent<LookDirection>();
        this.mAnimator = this.GetComponent<Animator>();
    }

    public virtual void MyStart()
    {

    }

    public virtual void MyUpdate()
    {
        if (DestroyWhenNotVisible && !this.mRender.isVisible)
        {
            this.Destroy();
        }
    }

    public virtual void Destroy()
    {

    }

    private void Awake()
    {
        MyAwake();
    }

    private void Update()
    {
        MyUpdate();    
    }

    private void Start()
    {
        MyStart();
    }
}

