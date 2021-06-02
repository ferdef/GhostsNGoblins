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

    public virtual void Destroy()
    {
        GameObject.Destroy(this.gameObject);
    }

    public virtual void HitByPlayerShot()
    {
    }

    protected virtual void Awake()
    {
        this.mRender = this.GetComponent<SpriteRenderer>();
        this.mRigidBody = this.GetComponent<Rigidbody2D>();
        this.mLookDir = this.GetComponent<LookDirection>();
        this.mAnimator = this.GetComponent<Animator>();
    }

    protected virtual void Start()
    {
    }

    protected virtual void Update()
    {
        if (DestroyWhenNotVisible && !this.mRender.isVisible)
        {
            this.Destroy();
        }
    }
}

