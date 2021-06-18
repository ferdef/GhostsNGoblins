using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class Ladder : MonoBehaviour
{
    public PlatformEffector2D ClimbDownEffector;
    public BoxCollider2D PrincipalTrigger;
    public BoxCollider2D UpTrigger;
    public BoxCollider2D DownTrigger;

    // Start is called before the first frame update
    void Start()
    {
        if (!GameManager.CurrentLevel.Ladders.Contains(this))
        {
            GameManager.CurrentLevel.Ladders.Add(this);
        }
    }

    // Update is called once per frame
    void Update()
    {
        
    }
}
