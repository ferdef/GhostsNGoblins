using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class LookDirection : MonoBehaviour
{
    private bool mLookLeft;
    private SpriteRenderer mRender;
    public bool LookLeft
    {
        get { return mLookLeft; }
        set
        {
            mLookLeft = value;
            mRender.flipX = mLookLeft;
        }
    }

    private void Awake()
    {
        mRender = this.GetComponent<SpriteRenderer>();
    }

    // Start is called before the first frame update
    void Start()
    {
        
    }

    // Update is called once per frame
    void Update()
    {
        
    }
}
