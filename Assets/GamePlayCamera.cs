using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class GamePlayCamera : MonoBehaviour
{
    public float MinCameraX;
    public float MaxCameraX;
    // Start is called before the first frame update
    void Start()
    {
        
    }

    // Update is called once per frame
    void Update()
    {
        float newX = GameManager.Player.transform.position.x + 4;
        newX = Mathf.Max(newX, MinCameraX);
        newX = Mathf.Min(newX, MaxCameraX);
        this.transform.position = new Vector3(newX, this.transform.position.y, this.transform.position.z);
    }
}
