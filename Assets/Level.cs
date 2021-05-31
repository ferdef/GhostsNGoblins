using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class Level : MonoBehaviour
{
    private List<GameObject> mToDestroyOnNextFrame = new List<GameObject>();

    private void Awake()
    {
        GameManager.CurrentLevel = this;
    }

    // Start is called before the first frame update
    void Start()
    {
        
    }

    // Update is called once per frame
    void Update()
    {
        foreach (GameObject go in mToDestroyOnNextFrame)
            GameObject.DestroyImmediate(go);
        mToDestroyOnNextFrame.Clear();
    }

    public void DestroyOnNextFrame(GameObject pObj)
    {
        mToDestroyOnNextFrame.Add(pObj);
    }
}
