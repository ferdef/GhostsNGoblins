using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class Plant : GameElement
{
    public GameObject PlantShotPrefab;
    public float ShotsPeriodSecs = 4;
    private float mTimeToNextShot;

    protected override void Awake()
    {
        base.Awake();
    }

    // Start is called before the first frame update
    protected override void Start()
    {
        mTimeToNextShot = ShotsPeriodSecs;
        base.Start();    
    }

    // Update is called once per frame
    protected override void Update()
    {
        if (mRender.isVisible)
        {
            mTimeToNextShot -= Time.deltaTime;
            if (mTimeToNextShot <= 0)
            {
                SpawnPlantShot();
                mTimeToNextShot = ShotsPeriodSecs;
            }
        }
        base.Update();
    }

    private void SpawnPlantShot()
    {
        GameObject newObj =  GameObject.Instantiate(PlantShotPrefab, this.transform.position + new Vector3(0,1,0), Quaternion.identity);
        PlantShot shot = newObj.GetComponent<PlantShot>();
        shot.Direction = (GameManager.Player.transform.position + new Vector3(0, 1, 0)  - this.transform.position).normalized;
    }
}
